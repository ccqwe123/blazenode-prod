import React, { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import {
  Home,
  Cpu,
  ExternalLink ,
  UserPlus
} from 'lucide-react';
import { useSidebar } from '@/hooks/use-sidebar';

const navItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard', active: true },
    { icon: Cpu, label: 'Nodes', path: '/nodes', active: false },
    { icon: UserPlus, label: 'Referrals', path: '/referrals', active: false },
];
const cacheImage = async (src) => {
    if (sessionStorage.getItem(src)) {
      return sessionStorage.getItem(src) as string;
    }

    const response = await fetch(src);
    const blob = await response.blob();
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
        reader.onloadend = function () {
          const base64data = reader.result;
          if (base64data && typeof base64data === 'string') {
            sessionStorage.setItem(src, base64data);
            resolve(base64data);
          } else {
            reject(new Error('Failed to convert image to base64.'));
          }
        };

        reader.onerror = function () {
          reject(new Error('Failed to read image.'));
        };

        reader.readAsDataURL(blob);
    });
};

const Sidebar = () => {
    const { collapsed, mobileOpen, isMobile, toggleSidebar } = useSidebar();
    const [twitterImage, setTwitterImage] = useState<string | null>(null);
    const [discordImage, setDiscordImage] = useState<string | null>(null);
    const [telegramImage, setTelegramImage] = useState<string | null>(null);
    const [logo, setLogo] = useState<string | null>(null);
    useEffect(() => {
        const fetchAndCacheImages = async () => {
            try {
                const twitter = await cacheImage("/assets/images/twitter-x.svg");
                const discord = await cacheImage("/assets/images/discord.svg");
                const telegram = await cacheImage("/assets/images/telegram.svg");
                const logo = await cacheImage("/assets/images/Blazenode.svg");

              setTwitterImage(twitter);  
              setDiscordImage(discord);  
              setTelegramImage(telegram);
              setLogo(logo);
            } catch (error: unknown) {
              console.error('Error caching images:', error);
            }
          };

          fetchAndCacheImages();
    }, []);

    return (
      <>
        {/* Mobile backdrop */}
        {isMobile && mobileOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20"
            onClick={toggleSidebar}
          />
        )}

        <aside
          className={`
            fixed top-0 left-0 h-screen z-30 transition-all duration-300
            ${isMobile ? (mobileOpen ? 'translate-x-0' : '-translate-x-full') : ''}
            ${collapsed && !isMobile ? 'w-[70px]' : 'w-[300px]'}
            backdrop-blur-md border-zinc-950 bg-black border-r-[1px]
            flex flex-col
          `}
        >
          <div className="mt-3 px-4 flex justify-start">
              <img
                src={logo || "/assets/images/Blazenode.svg"}
                alt="logo" className="h-[100px] w-[200px] object-contain" />
          </div>

          <div className="flex-1 overflow-y-auto px-2 py-4 mt-10 flex flex-col justify-between scrollbar-hidden">
            <nav className="space-y-1">
                {navItems.map((item) => {
                const isActive = window.location.pathname === item.path;
                return (
                    <Link
                    key={item.label}
                    href={item.path}
                    className={`nav-item mr-5 mb-2 py-3 px-5 ${isActive ? 'active' : ''} ${
                        collapsed && !isMobile ? 'justify-center' : ''
                    }`}
                    >
                    <item.icon className="w-5 h-5" />
                    {(!collapsed || isMobile) && <span>{item.label}</span>}
                    </Link>
                );
                })}
            </nav>
            <nav className="space-y-1">
                {/* <a
                    target="_blank"
                    className="group flex items-center w-full justify-between mb-2 px-5"
                    href="#"
                >
                    <div className="flex items-center">
                    <div className="relative flex items-center justify-center w-8 h-8 flex-shrink-0 border-theme-gray10 border-1.5 rounded-[6px] overflow-hidden group-hover:border-transparent mr-3">
                        <div className="absolute z-0 group-hover:h-full top-auto bottom-0 left-0 w-full h-0 bg-black-1 transition-all duration-300 ease-in-out"></div>
                        <Newspaper
                        className="z-10 absolute transition-all duration-300 ease-in-out w-4 h-4 object-cover"
                        />
                    </div>
                    <div className="text-base text-black-1">Docs</div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-white" />
                </a> */}
                <a
                    target="_blank"
                    className="group flex items-center w-full justify-between mb-2 px-5"
                    href="#"
                >
                    <div className="flex items-center">
                    <div className="relative flex items-center justify-center w-8 h-8 flex-shrink-0 border-theme-gray10 border-1.5 rounded-[6px] overflow-hidden group-hover:border-transparent mr-3">
                        <div className="absolute z-0 group-hover:h-full top-auto bottom-0 left-0 w-full h-0 bg-black-1 transition-all duration-300 ease-in-out"></div>
                        <img
                        src={twitterImage || "/assets/images/twitter-x.svg"}
                        alt="twitter"
                        className="z-10 absolute transition-all duration-300 ease-in-out w-4 h-4 object-cover"
                        style={{ filter: 'invert(1)' }}
                        loading="lazy"
                        />
                    </div>
                    <div className="text-base text-black-1">X(Twitter)</div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-white" />
                </a>
                <a
                    target="_blank"
                    className="group flex items-center w-full justify-between mb-2 px-5"
                    href="#"
                >
                    <div className="flex items-center">
                    <div className="relative flex items-center justify-center w-8 h-8 flex-shrink-0 border-theme-gray10 border-1.5 rounded-[6px] overflow-hidden group-hover:border-transparent mr-3">
                        <div className="absolute z-0 group-hover:h-full top-auto bottom-0 left-0 w-full h-0 bg-black-1 transition-all duration-300 ease-in-out"></div>
                        <img
                        src={discordImage || "/assets/images/discord.svg"}
                        alt="twitter"
                        className="z-10 absolute transition-all duration-300 ease-in-out w-4 h-4 object-cover"
                        style={{ filter: 'invert(1)' }}
                        loading="lazy"
                        />
                    </div>
                    <div className="text-base text-black-1">Discord</div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-white" />
                </a>
                <a
                    target="_blank"
                    className="group flex items-center w-full justify-between py-0 px-5"
                    href="#"
                >
                    <div className="flex items-center">
                    <div className="relative flex items-center justify-center w-8 h-8 flex-shrink-0 border-theme-gray10 border-1.5 rounded-[6px] overflow-hidden group-hover:border-transparent mr-3">
                        <div className="absolute z-0 group-hover:h-full top-auto bottom-0 left-0 w-full h-0 bg-black-1 transition-all duration-300 ease-in-out"></div>
                        <img
                        src={telegramImage || "/assets/images/telegram.svg"}
                        alt="twitter"
                        className="z-10 absolute transition-all duration-300 ease-in-out w-4 h-4 object-cover"
                        style={{ filter: 'invert(1)' }}
                        loading="lazy"
                        />
                    </div>
                    <div className="text-base text-black-1">Telegram</div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-white" />
                </a>
            </nav>
        </div>
          <div className={`p-4 border-t border-zinc-900 bg-black ${collapsed && !isMobile ? 'text-center' : ''}`}>
            <div className="roller-stat glow-effect">
              <div className="flex items-center gap-2 mb-2">
                {(!collapsed || isMobile) && <span className="text-xs text-white/60">Mining Power</span>}
              </div>
              <div className="flex flex-col">
                <p className="text-lg font-bold text-white">1.24 PH/s</p>
                {(!collapsed || isMobile) && (
                  <div className="w-full bg-roller-dark/50 h-1.5 rounded-full mt-2">
                    <div className="bg-gradient-to-r from-roller-primary to-roller-accent h-1.5 rounded-full w-[45%]" />
                  </div>
                )}
              </div>
            </div>
          </div>

        </aside>
      </>
    );
  };

  export default Sidebar;
