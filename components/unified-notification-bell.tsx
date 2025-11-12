"use client"

import { useState, useRef, useEffect } from 'react'
import { Bell, X, Check, CheckCheck, Trash2, AlertCircle, Info, AlertTriangle, Calendar, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useMembershipNotifications } from '@/hooks/use-membership-notifications'
import { useReservationNotifications } from '@/hooks/use-reservation-notifications'
import { MembershipNotification, NotificationPriority } from '@/types/notification'
import { ReservationNotification } from '@/hooks/use-reservation-notifications'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

type UnifiedNotification = (MembershipNotification | ReservationNotification) & {
  source: 'membership' | 'reservation'
}

export function UnifiedNotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'all' | 'membership' | 'reservation'>('all')
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  // Hooks de notificaciones
  const membershipNotifs = useMembershipNotifications()
  const reservationNotifs = useReservationNotifications()

  // Total de notificaciones no leídas
  const totalUnreadCount = membershipNotifs.unreadCount + reservationNotifs.unreadCount

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Unificar notificaciones
  const allNotifications: UnifiedNotification[] = [
    ...membershipNotifs.notifications.map(n => ({ ...n, source: 'membership' as const })),
    ...reservationNotifs.notifications.map(n => ({ ...n, source: 'reservation' as const }))
  ].sort((a, b) => {
    // No leídas primero
    if (a.read !== b.read) return a.read ? 1 : -1
    // Luego por fecha
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  })

  const filteredNotifications = activeTab === 'all' 
    ? allNotifications
    : allNotifications.filter(n => n.source === activeTab)

  const handleNotificationClick = (notification: UnifiedNotification) => {
    if (!notification.read) {
      if (notification.source === 'membership') {
        membershipNotifs.markAsRead([notification.id])
      } else {
        reservationNotifs.markAsRead(notification.id)
      }
    }
    
    if ('actionUrl' in notification && notification.actionUrl) {
      setIsOpen(false)
    }
  }

  const handleDelete = (e: React.MouseEvent, notification: UnifiedNotification) => {
    e.stopPropagation()
    if (notification.source === 'membership') {
      membershipNotifs.deleteNotification(notification.id)
    } else {
      reservationNotifs.clearNotifications()
    }
  }

  const handleMarkAllAsRead = () => {
    membershipNotifs.markAllAsRead()
    reservationNotifs.markAllAsRead()
  }

  const handleClearAll = () => {
    membershipNotifs.clearAll()
    reservationNotifs.clearNotifications()
  }

  const getNotificationIcon = (notification: UnifiedNotification) => {
    if (notification.source === 'membership') {
      const priority = (notification as MembershipNotification).priority
      switch (priority) {
        case NotificationPriority.CRITICAL:
          return <AlertCircle className="w-5 h-5 text-red-500" />
        case NotificationPriority.HIGH:
          return <AlertTriangle className="w-5 h-5 text-orange-500" />
        case NotificationPriority.MEDIUM:
          return <Info className="w-5 h-5 text-blue-500" />
        default:
          return <Info className="w-5 h-5 text-gray-500" />
      }
    } else {
      const type = (notification as ReservationNotification).type
      switch (type) {
        case 'reminder':
          return <Clock className="w-5 h-5 text-blue-500" />
        case 'confirmation':
          return <Check className="w-5 h-5 text-green-500" />
        case 'cancellation':
          return <Trash2 className="w-5 h-5 text-red-500" />
        case 'update':
          return <Calendar className="w-5 h-5 text-yellow-500" />
        default:
          return <Bell className="w-5 h-5 text-gray-500" />
      }
    }
  }

  const getNotificationColor = (notification: UnifiedNotification) => {
    if (notification.source === 'membership') {
      const priority = (notification as MembershipNotification).priority
      switch (priority) {
        case NotificationPriority.CRITICAL:
          return 'border-l-4 border-red-500 bg-red-500/5'
        case NotificationPriority.HIGH:
          return 'border-l-4 border-orange-500 bg-orange-500/5'
        case NotificationPriority.MEDIUM:
          return 'border-l-4 border-blue-500 bg-blue-500/5'
        default:
          return 'border-l-4 border-gray-500 bg-gray-500/5'
      }
    } else {
      return 'border-l-4 border-blue-500 bg-blue-500/5'
    }
  }

  const formatTimestamp = (timestamp: string | Date) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 1) return 'Ahora'
    if (diffMins < 60) return `Hace ${diffMins} min`
    if (diffHours < 24) return `Hace ${diffHours}h`
    if (diffDays === 1) return 'Ayer'
    if (diffDays < 7) return `Hace ${diffDays} días`
    
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative hover:bg-theme-secondary/20 text-theme-primary"
        aria-label={`Notificaciones ${totalUnreadCount > 0 ? `(${totalUnreadCount} sin leer)` : ''}`}
      >
        <Bell className="w-5 h-5 text-gray-300" />
        {totalUnreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs font-bold bg-red-600"
          >
            {totalUnreadCount > 9 ? '9+' : totalUnreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-theme-primary border border-theme rounded-lg shadow-xl z-50 max-h-[600px] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-theme">
            <h3 className="font-semibold text-lg text-theme-primary">Notificaciones</h3>
            <div className="flex items-center gap-2">
              {totalUnreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="text-xs hover:bg-theme-secondary/20"
                >
                  <CheckCheck className="w-3 h-3 mr-1" />
                  Marcar todas
                </Button>
              )}
              {allNotifications.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAll}
                  className="text-xs text-red-500 hover:bg-red-500/10"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Limpiar
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)} className="flex-1 flex flex-col">
            <TabsList className="w-full grid grid-cols-3 bg-theme-secondary/20">
              <TabsTrigger value="all" className="text-xs">
                Todas ({allNotifications.length})
              </TabsTrigger>
              <TabsTrigger value="membership" className="text-xs">
                Membresía ({membershipNotifs.notifications.length})
              </TabsTrigger>
              <TabsTrigger value="reservation" className="text-xs">
                Reservas ({reservationNotifs.notifications.length})
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                  <Bell className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-theme-secondary text-sm text-center">
                    No tienes notificaciones
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-theme">
                  {filteredNotifications.map((notification) => {
                    const hasActionUrl = 'actionUrl' in notification && notification.actionUrl
                    
                    const content = (
                      <>
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <p className={`text-sm font-medium text-theme-primary ${!notification.read ? 'font-semibold' : ''}`}>
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-1" />
                            )}
                          </div>
                          
                          <p className="text-xs text-theme-secondary mb-2 line-clamp-2">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-theme-secondary">
                              {formatTimestamp(notification.timestamp)}
                            </span>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => handleDelete(e, notification)}
                              className="h-6 px-2 text-xs text-red-500 hover:bg-red-500/10"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </>
                    )

                    if (hasActionUrl) {
                      return (
                        <Link
                          key={notification.id}
                          href={notification.actionUrl!}
                          onClick={() => handleNotificationClick(notification)}
                          className={`
                            flex items-start gap-3 p-4 cursor-pointer transition-colors
                            ${getNotificationColor(notification)}
                            ${!notification.read ? 'bg-opacity-100' : 'bg-opacity-50'}
                            hover:bg-theme-secondary/30
                          `}
                        >
                          {content}
                        </Link>
                      )
                    }

                    return (
                      <div
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`
                          flex items-start gap-3 p-4 cursor-pointer transition-colors
                          ${getNotificationColor(notification)}
                          ${!notification.read ? 'bg-opacity-100' : 'bg-opacity-50'}
                          hover:bg-theme-secondary/30
                        `}
                      >
                        {content}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </Tabs>
        </div>
      )}
    </div>
  )
}
