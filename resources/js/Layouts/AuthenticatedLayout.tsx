import React, { ReactNode, useState } from 'react';
import Header from './Headers';
import Sidebar from './Sidebar';
import { useSidebar } from '@/hooks/use-sidebar';
import { Toaster } from "@/Components/toaster";
interface AuthenticatedProps {
    // user: {
    //     id: number;
    //     name: string;
    //     email: string;
    // };
    header?: ReactNode;
    children: ReactNode;
}

// export default function Authenticated({ header, children }: AuthenticatedProps) {
//     const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
//     const { collapsed, isMobile } = useSidebar();
//     return (
//         <>
//             <Toaster />
//             <Sidebar />
//             <Header />

//           <main className={`flex-1 pt-16 transition-all duration-300 ${
//             isMobile ? 'ml-0' : (collapsed ? 'ml-[70px]' : 'ml-[250px]')
//           }`}>
//             <div className="container px-6 py-6 max-w-full lg:max-w-[1550px] mx-auto">
//               {children}
//             </div>
//           </main>
//         </>
//     );
// }
const Authenticated: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { collapsed, isMobile } = useSidebar();
    return (
        <>
            <Toaster />
            <Sidebar />
            <Header />

          <main className={`flex-1 pt-16 transition-all duration-300 ${
            isMobile ? 'ml-0' : (collapsed ? 'ml-[70px]' : 'ml-[300px]')
          }`}>
            <div className="container px-6 py-6 max-w-full lg:max-w-[1550px] mx-auto">
              {children}
            </div>
          </main>
        </>
    );
}
export default Authenticated;
