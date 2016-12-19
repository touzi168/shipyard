package api

import (
	"encoding/json"
	"net/http"

	log "github.com/Sirupsen/logrus"
	"github.com/shipyard/shipyard/auth"
	"github.com/shipyard/shipyard/auth/ldap"
	"github.com/shipyard/shipyard/controller/manager"
)

func (a *Api) login(w http.ResponseWriter, r *http.Request) {
	var creds *Credentials
	if err := json.NewDecoder(r.Body).Decode(&creds); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	loginSuccessful, err := a.manager.Authenticate(creds.Username, creds.Password)
	if err != nil {
		log.Errorf("登陆出错 %s from %s: %s", creds.Username, r.RemoteAddr, err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if !loginSuccessful {
		log.Warnf("无效的登陆r %s from %s", creds.Username, r.RemoteAddr)
		http.Error(w, "无效的用户名和密码", http.StatusForbidden)
		//http.Error(w, "invalid username/password", http.StatusForbidden)
		return
	}

	// check for ldap and autocreate for users
	if a.manager.GetAuthenticator().Name() == "ldap" {
		if a.manager.GetAuthenticator().(*ldap.LdapAuthenticator).AutocreateUsers {
			defaultAccessLevel := a.manager.GetAuthenticator().(*ldap.LdapAuthenticator).DefaultAccessLevel
			log.Debug("ldap: checking for existing user account and creating if necessary")
			// give default users readonly access to containers
			acct := &auth.Account{
				Username: creds.Username,
				Roles:    []string{defaultAccessLevel},
			}

			// check for existing account
			if _, err := a.manager.Account(creds.Username); err != nil {
				if err == manager.ErrAccountDoesNotExist {
					log.Debugf("autocreating user for ldap: username=%s access=%s", creds.Username, defaultAccessLevel)
					if err := a.manager.SaveAccount(acct); err != nil {
						log.Errorf("error autocreating ldap user %s: %s", creds.Username, err)
						http.Error(w, err.Error(), http.StatusInternalServerError)
						return
					}
				} else {
					log.Errorf("error checking user for autocreate: %s", err)
					http.Error(w, err.Error(), http.StatusInternalServerError)
					return
				}
			}

		}
	}
	acct, err := a.manager.Account(creds.Username); 
	if err != nil {
		if err == manager.ErrAccountDoesNotExist {
			log.Errorf("error autocreating user %s: %s", creds.Username, err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		} else {
			log.Errorf("error checking user for autocreate: %s", err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}

	// return token
	token, err := a.manager.NewAuthToken(creds.Username, r.UserAgent())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	token.Role = acct.Roles[0];
	if err := json.NewEncoder(w).Encode(token); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func (a *Api) signup(w http.ResponseWriter, r *http.Request) {
	controllerManager := a.manager
	var creds *auth.SignupInfo
	if err := json.NewDecoder(r.Body).Decode(&creds); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if _, err := controllerManager.Account(creds.Username); err != manager.ErrAccountDoesNotExist {
		log.Errorf("注册失败 %s from %s: 用户已存在", creds.Username, r.RemoteAddr, err)
		http.Error(w, "用户已存在", http.StatusInternalServerError)
		return
	}

	if creds.Password != creds.Confirm {
		log.Errorf("注册失败 %s from %s: %s", creds.Username, r.RemoteAddr, "两次输入的密码不一致")
		http.Error(w, "两次输入的密码不一致", http.StatusInternalServerError)
		return
	}

	// create roles
	acct := &auth.Account{
		Username:  creds.Username,
		Password:  creds.Password,
		Email: creds.Email,
		Roles:     []string{"user"},
	}
	if err := controllerManager.SaveAccount(acct); err != nil {
		log.Fatal(err)
	}
	log.Infof("created user: %s", creds.Username)

	loginSuccessful, err := a.manager.Authenticate(creds.Username, creds.Password)
	if err != nil {
		log.Errorf("登陆出错 %s from %s: %s", creds.Username, r.RemoteAddr, err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if !loginSuccessful {
		log.Warnf("无效的登陆 %s from %s", creds.Username, r.RemoteAddr)
		http.Error(w, "无效的用户名和密码", http.StatusForbidden)
		//http.Error(w, "invalid username/password", http.StatusForbidden)
		return
	}

	// check for ldap and autocreate for users
	if a.manager.GetAuthenticator().Name() == "ldap" {
		if a.manager.GetAuthenticator().(*ldap.LdapAuthenticator).AutocreateUsers {
			defaultAccessLevel := a.manager.GetAuthenticator().(*ldap.LdapAuthenticator).DefaultAccessLevel
			log.Debug("ldap: checking for existing user account and creating if necessary")
			// give default users readonly access to containers
			acct := &auth.Account{
				Username: creds.Username,
				Roles:    []string{defaultAccessLevel},
			}

			// check for existing account
			if _, err := a.manager.Account(creds.Username); err != nil {
				if err == manager.ErrAccountDoesNotExist {
					log.Debugf("autocreating user for ldap: username=%s access=%s", creds.Username, defaultAccessLevel)
					if err := a.manager.SaveAccount(acct); err != nil {
						log.Errorf("error autocreating ldap user %s: %s", creds.Username, err)
						http.Error(w, err.Error(), http.StatusInternalServerError)
						return
					}
				} else {
					log.Errorf("error checking user for autocreate: %s", err)
					http.Error(w, err.Error(), http.StatusInternalServerError)
					return
				}
			}

		}
	}

	// return token
	token, err := a.manager.NewAuthToken(creds.Username, r.UserAgent())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	token.Role = "user";
	if err := json.NewEncoder(w).Encode(token); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func (a *Api) changePassword(w http.ResponseWriter, r *http.Request) {
	session, _ := a.manager.Store().Get(r, a.manager.StoreKey())
	var creds *Credentials
	if err := json.NewDecoder(r.Body).Decode(&creds); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	username := session.Values["username"].(string)
	if username == "" {
		http.Error(w, "没有认证", http.StatusInternalServerError)
		//http.Error(w, "unauthorized", http.StatusInternalServerError)
		return
	}
	if err := a.manager.ChangePassword(username, creds.Password); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
