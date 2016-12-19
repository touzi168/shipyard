package auth

type (
	ACL struct {
		RoleName    string        `json:"role_name,omitempty"`
		Description string        `json:"description,omitempty"`
		Rules       []*AccessRule `json:"rules,omitempty"`
	}

	AccessRule struct {
		Path    string   `json:"path,omitempty"`
		Methods []string `json:"methods,omitempty"`
	}

	STATUS struct {
		StatusName  string        `json:"status,omitempty"`
		Description string        `json:"description,omitempty"`
	}
)

func DefaultACLs() []*ACL {
	acls := []*ACL{}
	adminACL := &ACL{
		RoleName:    "admin",
		Description: "管理员",
		Rules: []*AccessRule{
			{
				Path:    "*",
				Methods: []string{"*"},
			},
		},
	}
	acls = append(acls, adminACL)

	userACL := &ACL{
		RoleName:    "user",
		Description: "普通用户",
		Rules: []*AccessRule{
			{
				Path:    "/api/books",
				Methods: []string{"GET", "POST", "DELETE"},
			},
			{
				Path:    "/api/roles",
				Methods: []string{"GET"},
			},
			{
				Path:    "/api/accounts",
				Methods: []string{"GET"},
			},
			{
				Path:    "/api/statuses",
				Methods: []string{"GET"},
			},
		},
	}
	acls = append(acls, userACL)

	return acls
}

func DefaultStatus() []*STATUS {
	sts := []*STATUS{}
	availableST := &STATUS{
		StatusName:    "available",
		Description: "可借阅",
	}
	sts = append(sts, availableST)

	lendedST := &STATUS{
		StatusName:    "lended",
		Description: "已出借",
	}
	sts = append(sts, lendedST)

	return sts
}
