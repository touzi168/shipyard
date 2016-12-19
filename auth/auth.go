package auth

import (
	"errors"
	"strings"
	"time"

	"golang.org/x/crypto/bcrypt"
)

var (
	ErrUnauthorized  = errors.New("无效的认证")
	ErrNoUserInToken = errors.New("没有用户发送令牌")
)

type (
	Account struct {
		ID        string       `json:"id,omitempty" gorethink:"id,omitempty"`
		FirstName string       `json:"first_name,omitempty" gorethink:"first_name,omitempty"`
		LastName  string       `json:"last_name,omitempty" gorethink:"last_name,omitempty"`
		Username  string       `json:"username,omitempty" gorethink:"username"`
		Password  string       `json:"password,omitempty" gorethink:"password"`
		Email     string       `json:"email,omitempty" gorethink:"email,omitempty"`
		Tokens    []*AuthToken `json:"-" gorethink:"tokens"`
		Roles     []string     `json:"roles,omitempty" gorethink:"roles"`
	}

	SignupInfo struct {
		ID        string       `json:"id,omitempty" gorethink:"id,omitempty"`
		Username  string       `json:"username,omitempty" gorethink:"username,omitempty"`
		Password  string       `json:"password,omitempty" gorethink:"password"`
		Confirm   string       `json:"confirm,omitempty" gorethink:"confirm"`
		Email     string       `json:"email,omitempty" gorethink:"email,omitempty"`
	}

	Book struct {
		ID        string       `json:"id,omitempty" gorethink:"id,omitempty"`
		BookName  string       `json:"bookname,omitempty" gorethink:"bookname"`
		BookAuthor string      `json:"bookauthor,omitempty" gorethink:"bookauthor"`
		BookDesc  string       `json:"bookdesc,omitempty" gorethink:"bookdesc,omitempty"`
		BookStatus []string    `json:"bookstatus,omitempty" gorethink:"bookstatus,omitempty"`
		BookOwer   []string    `json:"bookower,omitempty" gorethink:"bookower,omitempty"`
	}

	AuthToken struct {
		Token     string `json:"auth_token,omitempty" gorethink:"auth_token"`
		UserAgent string `json:"user_agent,omitempty" gorethink:"user_agent"`
		Role      string `json:"role,omitempty" gorethink:"role"`
	}

	AccessToken struct {
		Token    string
		Username string
	}

	ServiceKey struct {
		Key         string `json:"key,omitempty" gorethink:"key"`
		Description string `json:"description,omitempty" gorethink:"description"`
	}

	Authenticator interface {
		Authenticate(username, password, hash string) (bool, error)
		GenerateToken() (string, error)
		IsUpdateSupported() bool
		Name() string
	}
)

func Hash(data string) (string, error) {
	h, err := bcrypt.GenerateFromPassword([]byte(data), bcrypt.DefaultCost)
	return string(h[:]), err
}

func GenerateToken() (string, error) {
	return Hash(time.Now().String())
}

// GetAccessToken returns an AccessToken from the access header
func GetAccessToken(authToken string) (*AccessToken, error) {
	parts := strings.Split(authToken, ":")

	if len(parts) != 2 {
		return nil, ErrNoUserInToken

	}

	return &AccessToken{
		Username: parts[0],
		Token:    parts[1],
	}, nil

}
