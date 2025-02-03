import { DashboardSidebarMenuInterface } from "@/lib/types";

const SidebarNavAdmin = ({ menuLinks }: { menuLinks: DashboardSidebarMenuInterface[] } ) => {
    return <div>
        {
            menuLinks.map((link) => link.icon) 
        }
    </div>;
}
 
export default SidebarNavAdmin;

