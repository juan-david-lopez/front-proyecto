// components/membership-notification-bell.tsx
"use client"

import { useState, useRef, useEffect } from 'react'
import { Bell, X, Check, CheckCheck, Trash2, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useMembershipNotifications } from '@/hooks/use-membership-notifications'
import { MembershipNotification, NotificationPriority } from '@/types/notification'
import Link from 'next/link'

export function MembershipNotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, clearAll } = useMembershipNotifications()

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

  const handleNotificationClick = (notification: MembershipNotification) => {
    if (!notification.read) {
      markAsRead([notification.id])
    }
    
    if (notification.actionUrl) {
      setIsOpen(false)
    }
  }

  const handleDelete = (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation()
    deleteNotification(notificationId)
  }

  const getPriorityIcon = (priority: NotificationPriority) => {
    switch (priority) {
      case NotificationPriority.CRITICAL:
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case NotificationPriority.HIGH:
        return <AlertTriangle className="w-5 h-5 text-orange-500" />
      case NotificationPriority.MEDIUM:
        return <Info className="w-5 h-5 text-blue-500" />
      case NotificationPriority.LOW:
        return <Info className="w-5 h-5 text-gray-500" />
      default:
        return <Info className="w-5 h-5 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: NotificationPriority) => {
    switch (priority) {
      case NotificationPriority.CRITICAL:
        return 'border-l-4 border-red-500 bg-red-500/5'
      case NotificationPriority.HIGH:
        return 'border-l-4 border-orange-500 bg-orange-500/5'
      case NotificationPriority.MEDIUM:
        return 'border-l-4 border-blue-500 bg-blue-500/5'
      case NotificationPriority.LOW:
        return 'border-l-4 border-gray-500 bg-gray-500/5'
      default:
        return 'border-l-4 border-gray-500'
    }
  }

  const formatTimestamp = (timestamp: string) => {
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

  // Ordenar notificaciones: no leídas primero, luego por fecha
  const sortedNotifications = [...notifications].sort((a, b) => {
    if (a.read !== b.read) return a.read ? 1 : -1
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  })

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botón de la campana */}
      <Button
        variant="ghost"
        size="sm"
        className="relative p-2 hover:bg-gray-700/50"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Notificaciones. ${unreadCount} sin leer`}
      >
        <Bell className="w-5 h-5 text-gray-300" />
        {unreadCount > 0 && (
          <Badge 
            className="absolute -top-1 -right-1 h-5 min-w-[20px] flex items-center justify-center p-0 bg-red-600 text-white text-xs"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Dropdown de notificaciones */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] bg-gray-900 border border-gray-700 rounded-lg shadow-2xl z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800/50">
            <div>
              <h3 className="font-semibold text-white">Notificaciones</h3>
              {unreadCount > 0 && (
                <p className="text-xs text-gray-400 mt-0.5">
                  {unreadCount} sin leer
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {notifications.length > 0 && (
                <>
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllAsRead}
                      className="text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                      title="Marcar todas como leídas"
                    >
                      <CheckCheck className="w-4 h-4 mr-1" />
                      Marcar leídas
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAll}
                    className="text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    title="Eliminar todas"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Lista de notificaciones */}
          <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">No tienes notificaciones</p>
                <p className="text-gray-500 text-xs mt-1">Te avisaremos cuando haya novedades</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-700">
                {sortedNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-800/50 transition-colors cursor-pointer ${
                      !notification.read ? 'bg-gray-800/30' : ''
                    } ${getPriorityColor(notification.priority)}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icono de prioridad */}
                      <div className="flex-shrink-0 mt-0.5">
                        {getPriorityIcon(notification.priority)}
                      </div>

                      {/* Contenido */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className={`text-sm font-semibold ${
                            !notification.read ? 'text-white' : 'text-gray-300'
                          }`}>
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1" />
                          )}
                        </div>
                        
                        <p className="text-xs text-gray-400 mb-2 line-clamp-2">
                          {notification.message}
                        </p>

                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs text-gray-500">
                            {formatTimestamp(notification.timestamp)}
                          </span>

                          <div className="flex items-center gap-2">
                            {notification.actionUrl && notification.actionLabel && (
                              <Link 
                                href={notification.actionUrl}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Button
                                  size="sm"
                                  className="h-6 text-xs bg-blue-600 hover:bg-blue-700"
                                >
                                  {notification.actionLabel}
                                </Button>
                              </Link>
                            )}

                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  markAsRead([notification.id])
                                }}
                                className="h-6 px-2 text-xs text-gray-400 hover:text-white"
                                title="Marcar como leída"
                              >
                                <Check className="w-3 h-3" />
                              </Button>
                            )}

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => handleDelete(e, notification.id)}
                              className="h-6 px-2 text-xs text-gray-400 hover:text-red-400"
                              title="Eliminar"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-700 bg-gray-800/50 text-center">
              <Link href="/dashboard/notificaciones">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                  onClick={() => setIsOpen(false)}
                >
                  Ver todas las notificaciones
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
