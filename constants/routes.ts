const ROUTES = {
    HOME: "/",
    SIGN_UP: "/sign-up",
    SIGN_IN: "/sign-in",
    SIGN_IN_WITH_OAUTH: `signin-with-oAuth`,

    TRAINER: (id: string) => `/trainers/${id}`,

    ADMIN_DELET_USER:"/admin/delete-users"

}

export default ROUTES