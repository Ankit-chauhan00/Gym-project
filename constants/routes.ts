const ROUTES = {
    HOME: "/",
    SIGN_UP: "/sign-up",
    SIGN_IN: "/sign-in",
    SIGN_IN_WITH_OAUTH: `signin-with-oAuth`,

    TRAINER: (id: string) => `/trainers/${id}`,
    PRODUCT: (id: string) => `/products/${id}`,
    PRODUCT3D: (id: string)=> `/products/${id}/3d-section`,



    USER_PROFILE:(id: string)=> `/profile/${id}`,
    USER_EDIT:(id: string) => `/profile/${id}/edit`,
    USER_CART: (id: string)=> `/profile/${id}/cart`,

    ADMIN: `/admin`,
    ADMIN_DELET_USER:"/admin/delete-users"

}

export default ROUTES