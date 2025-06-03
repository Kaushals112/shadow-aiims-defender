
import { Calendar, Home, Users, Activity, Database, Settings, Shield, Eye } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { SessionManager } from "../utils/sessionManager"
import { useState, useEffect } from "react"

const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    id: "patients"
  },
  {
    title: "Medical Reports",
    icon: Calendar,
    id: "reports"
  },
  {
    title: "Database Query",
    icon: Database,
    id: "database"
  },
  {
    title: "System Settings",
    icon: Settings,
    id: "settings"
  }
]

interface AppSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function AppSidebar({ activeTab, onTabChange }: AppSidebarProps) {
  const [activeSessions, setActiveSessions] = useState(0);

  useEffect(() => {
    const updateSessionCount = () => {
      const sessions = SessionManager.getActiveSessions();
      setActiveSessions(sessions.length);
    };

    updateSessionCount();
    const interval = setInterval(updateSessionCount, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            AIIMS Admin Portal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    onClick={() => onTabChange(item.id)}
                    isActive={activeTab === item.id}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>System Status</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-3 py-2 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Sessions</span>
                <Badge variant="default" className="bg-green-600">
                  {activeSessions}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">System Status</span>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Online
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Security Level</span>
                <Badge variant="outline" className="text-blue-600 border-blue-600">
                  High
                </Badge>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
