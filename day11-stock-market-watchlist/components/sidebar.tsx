"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BarChart2, BookOpen, Settings, TrendingUp } from 'lucide-react'

const sidebarItems = [
  { name: 'Dashboard', icon: BarChart2, path: '/' },
  { name: 'Watchlist', icon: TrendingUp, path: '/watchlist' },
  { name: 'News', icon: BookOpen, path: '/news' },
  { name: 'Settings', icon: Settings, path: '/settings' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:block">
      <div className="flex h-full flex-col gap-2">
        <div className="flex h-[60px] items-center border-b px-6">
          <Link className="flex items-center gap-2 font-semibold" href="/">
            <BarChart2 className="h-6 w-6" />
            <span className="">StockPro</span>
          </Link>
        </div>
        <ScrollArea className="flex-1 px-3">
          <div className="space-y-1 py-2">
            {sidebarItems.map((item) => (
              <Button
                key={item.path}
                asChild
                variant={pathname === item.path ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  pathname === item.path && "bg-secondary/50"
                )}
              >
                <Link href={item.path}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Link>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

