"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  aprobacionesPendientes?: number;
}

interface NavItem {
  href: string;
  label: string;
  icon: string;
  badge?: number;
}

interface NavGroup {
  grupo: string;
  items: NavItem[];
}

function Icon({ name }: { name: string }) {
  if (name === "grid")
    return (
      <svg
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
      </svg>
    );
  if (name === "bag")
    return (
      <svg
        width="30"
        height="30"
        viewBox="0 0 102 102"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>
          <path
            d="M23.8659 85.0004C21.964 85.0004 20.344 84.3318 19.006 82.9944C17.6687 81.6564 17 80.0364 17 78.1346V23.8663C17 21.9644 17.6687 20.3445 19.006 19.0064C20.344 17.6691 21.964 17.0004 23.8659 17.0004H43.571C43.9684 15.3387 44.851 13.9426 46.2188 12.8121C47.5865 11.6808 49.1803 11.1152 51 11.1152C52.8523 11.1152 54.4584 11.6808 55.8184 12.8121C57.1777 13.9426 58.0561 15.3387 58.4534 17.0004H78.1341C80.036 17.0004 81.656 17.6691 82.994 19.0064C84.3313 20.3445 85 21.9644 85 23.8663V78.1346C85 80.0364 84.3313 81.6564 82.994 82.9944C81.656 84.3318 80.036 85.0004 78.1341 85.0004H23.8659ZM23.8659 80.7504H78.1341C78.7886 80.7504 79.3882 80.4781 79.9329 79.9334C80.4776 79.3887 80.75 78.789 80.75 78.1346V23.8663C80.75 23.2118 80.4776 22.6122 79.9329 22.0675C79.3882 21.5228 78.7886 21.2504 78.1341 21.2504H68V30.7311H34V21.2504H23.8659C23.2114 21.2504 22.6118 21.5228 22.0671 22.0675C21.5224 22.6122 21.25 23.2118 21.25 23.8663V78.1346C21.25 78.789 21.5224 79.3887 22.0671 79.9334C22.6118 80.4781 23.2114 80.7504 23.8659 80.7504ZM53.4565 21.2547C54.1075 20.6037 54.4329 19.7849 54.4329 18.7982C54.4329 17.8122 54.1075 16.9937 53.4565 16.3427C52.8048 15.6918 51.986 15.3663 51 15.3663C50.014 15.3663 49.1952 15.6918 48.5435 16.3427C47.8925 16.9937 47.5671 17.8122 47.5671 18.7982C47.5671 19.7849 47.8925 20.6037 48.5435 21.2547C49.1952 21.9056 50.014 22.2311 51 22.2311C51.986 22.2311 52.8048 21.9056 53.4565 21.2547Z"
            fill="#D7D7D7"
          />
        </g>
      </svg>
    );
  if (name === "truck")
    return (
      <svg
        width="30"
        height="30"
        viewBox="0 0 102 102"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>
          <path
            d="M17 85V80.75H85V85H17ZM22.6398 64.0773L9.48069 42.091L15.6761 40.4728L27.0034 50.1341L44.5761 45.5483L23.6449 17.4495L31.5563 15.3818L61.7716 40.9881L79.9159 36.1824C81.5288 35.7631 83.0723 35.9876 84.5463 36.856C86.0204 37.7251 86.967 38.9661 87.3864 40.579C87.8057 42.1919 87.6354 43.7354 86.8753 45.2094C86.1153 46.6834 84.9288 47.6301 83.3159 48.0495L22.6398 64.0773Z"
            fill="#D7D7D7"
          />
        </g>
      </svg>
    );
  if (name === "user")
    return (
      <svg
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    );
  if (name === "bell")
    return (
      <svg
        width="30"
        height="30"
        viewBox="0 0 102 102"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>
          <path
            d="M50.9851 90.8841C49.0932 90.8841 47.4785 90.2119 46.1412 88.8675C44.8031 87.5231 44.1341 85.907 44.1341 84.0193H57.8659C57.8659 85.9212 57.1919 87.5408 55.8439 88.8781C54.4967 90.2155 52.8771 90.8841 50.9851 90.8841ZM75.5193 56.9659V44.2159H62.7693V39.9659H75.5193V27.2159H79.7693V39.9659H92.5193V44.2159H79.7693V56.9659H75.5193ZM21.25 79.7693V75.5193H28.1159V41.8466C28.1159 36.2939 29.8729 31.4103 33.3869 27.1958C36.9017 22.9812 41.356 20.3564 46.75 19.3216V17C46.75 15.8192 47.1623 14.8159 47.9868 13.9899C48.8113 13.1633 49.8125 12.75 50.9904 12.75C52.1684 12.75 53.1728 13.1633 54.0037 13.9899C54.8346 14.8159 55.25 15.8192 55.25 17V19.3216C56.5689 19.6049 57.8425 19.9601 59.0708 20.3873C60.2997 20.8151 61.4752 21.386 62.5972 22.1C62.0256 22.6015 61.4632 23.0995 60.9099 23.5939C60.3574 24.0883 59.874 24.6203 59.4596 25.1898C58.1754 24.5303 56.8271 24.0359 55.4147 23.7065C54.003 23.3764 52.5314 23.2114 51 23.2114C45.8348 23.2114 41.4379 25.0258 37.8091 28.6546C34.1803 32.2834 32.3659 36.6807 32.3659 41.8466V75.5193H69.6341V65.7443C70.3099 66.0333 70.9885 66.2759 71.6699 66.4721C72.3506 66.6676 73.0887 66.8256 73.8841 66.946V75.5193H80.75V79.7693H21.25Z"
            fill="#D7D7D7"
          />
        </g>
      </svg>
    );
  return null;
}

export default function Sidebar({ aprobacionesPendientes = 0 }: SidebarProps) {
  const pathname = usePathname();

  const links: NavGroup[] = [
    {
      grupo: "GENERAL",
      items: [{ href: "/admin", label: "Dashboard", icon: "grid" }],
    },
    {
      grupo: "VENTAS",
      items: [
        { href: "/admin/pedidos", label: "Pedidos", icon: "bag" },
        { href: "/admin/importaciones", label: "Importaciones", icon: "truck" },
      ],
    },
    {
      grupo: "CLIENTES",
      items: [
        {
          href: "/admin/aprobaciones",
          label: "Aprobaciones",
          icon: "user",
          badge: aprobacionesPendientes,
        },
      ],
    },
    {
      grupo: "CLIENTES",
      items: [
        { href: "/admin/suscriptores", label: "Suscriptores", icon: "bell" },
      ],
    },
  ];

  return (
    <aside className="w-52 min-h-screen bg-verde flex-shrink-0">
      <div className="p-5 border-b border-white/10">
        <p className="text-amarillo font-semibold text-base leading-tight">
          La llave del norte
        </p>
        <p className="text-white/40 text-xs mt-0.5">Panel de administración</p>
      </div>

      <nav className="p-3 space-y-5 mt-2">
        {links.map((grupo, gi) => (
          <div key={gi}>
            <p className="text-white/30 text-xs uppercase tracking-widest px-2 mb-1">
              {grupo.grupo}
            </p>
            <div className="space-y-0.5">
              {grupo.items.map((item) => {
                const activo = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      activo
                        ? "bg-amarillo/20 text-amarillo"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon name={item.icon} />
                    {item.label}
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
