import { userRoles } from "../../middlewares/auth.js";

export const endpoint = {
    profile: Object.values(userRoles)
}