export interface SidebarItem {
  id: string;
  name: string;
  icon?: string;
  children?: SidebarItem[];
}
