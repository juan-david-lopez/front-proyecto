// app/dashboard/notificaciones/page.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { 
  ArrowLeft, Bell, CheckCheck, Trash2, Filter,
  AlertCircle, Info, AlertTriangle
} from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { useMembershipNotifications } from "@/hooks/use-membership-notifications"
import { NotificationPriority, NotificationCategory } from "@/types/notification"
import { useState } from "react"

export default function NotificationsPage() {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    clearAll 
  } = useMembershipNotifications()

  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [categoryFilter, setCategoryFilter] = useState<NotificationCategory | 'all'>('all')

  const getPriorityIcon = (priority: NotificationPriority) => {
    switch (priority) {
      case NotificationPriority.CRITICAL:
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case NotificationPriority.HIGH:
        return <AlertTriangle className="w-5 h-5 text-orange-500" />
      default:
        return <Info className="w-5 h-5 text-blue-500" />
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
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredNotifications = notifications
    .filter(n => filter === 'all' || !n.read)
    .filter(n => categoryFilter === 'all' || n.category === categoryFilter)
    .sort((a, b) => {
      if (a.read !== b.read) return a.read ? 1 : -1
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    })

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
        <header className="border-b border-gray-800 bg-black/50 backdrop-blur-md sticky top-0 z-10">
          <div className="container mx-auto px-4 md:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Bell className="w-6 h-6" />
                    Notificaciones
                  </h1>
                  <p className="text-sm text-gray-400">
                    {unreadCount > 0 ? `${unreadCount} sin leer` : 'Todas leídas'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button
                    onClick={markAllAsRead}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <CheckCheck className="w-4 h-4 mr-2" />
                    Marcar todas leídas
                  </Button>
                )}
                {notifications.length > 0 && (
                  <Button
                    onClick={clearAll}
                    size="sm"
                    variant="outline"
                    className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Limpiar todo
                  </Button>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 md:px-6 py-8 max-w-4xl">
          {/* Filtros */}
          <Card className="bg-gray-800/50 border-gray-700 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400 mr-2">Filtros:</span>
                
                <Button
                  size="sm"
                  variant={filter === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilter('all')}
                  className="h-8"
                >
                  Todas ({notifications.length})
                </Button>
                <Button
                  size="sm"
                  variant={filter === 'unread' ? 'default' : 'outline'}
                  onClick={() => setFilter('unread')}
                  className="h-8"
                >
                  No leídas ({unreadCount})
                </Button>

                <div className="w-px h-6 bg-gray-700 mx-2" />

                <Button
                  size="sm"
                  variant={categoryFilter === 'all' ? 'default' : 'outline'}
                  onClick={() => setCategoryFilter('all')}
                  className="h-8"
                >
                  Todas
                </Button>
                <Button
                  size="sm"
                  variant={categoryFilter === NotificationCategory.MEMBERSHIP ? 'default' : 'outline'}
                  onClick={() => setCategoryFilter(NotificationCategory.MEMBERSHIP)}
                  className="h-8"
                >
                  Membresía
                </Button>
                <Button
                  size="sm"
                  variant={categoryFilter === NotificationCategory.PAYMENT ? 'default' : 'outline'}
                  onClick={() => setCategoryFilter(NotificationCategory.PAYMENT)}
                  className="h-8"
                >
                  Pagos
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Lista de notificaciones */}
          {filteredNotifications.length === 0 ? (
            <Card className="bg-gray-800/30 border-gray-700">
              <CardContent className="p-12 text-center">
                <Bell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">
                  No hay notificaciones
                </h3>
                <p className="text-gray-400">
                  {filter === 'unread' 
                    ? 'No tienes notificaciones sin leer' 
                    : 'Te avisaremos cuando haya novedades'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => (
                <Card 
                  key={notification.id}
                  className={`bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all ${
                    !notification.read ? 'ring-2 ring-blue-500/30' : ''
                  } ${getPriorityColor(notification.priority)}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        {getPriorityIcon(notification.priority)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h3 className={`text-lg font-semibold ${
                            !notification.read ? 'text-white' : 'text-gray-300'
                          }`}>
                            {notification.title}
                          </h3>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {!notification.read && (
                              <Badge className="bg-blue-500">Nueva</Badge>
                            )}
                            <Badge variant="outline" className="text-xs">
                              {notification.category}
                            </Badge>
                          </div>
                        </div>

                        <p className="text-gray-400 mb-3">
                          {notification.message}
                        </p>

                        <div className="flex items-center justify-between gap-4">
                          <span className="text-sm text-gray-500">
                            {formatTimestamp(notification.timestamp)}
                          </span>

                          <div className="flex items-center gap-2">
                            {notification.actionUrl && notification.actionLabel && (
                              <Link href={notification.actionUrl}>
                                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                  {notification.actionLabel}
                                </Button>
                              </Link>
                            )}
                            
                            {!notification.read && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => markAsRead([notification.id])}
                                className="border-gray-600"
                              >
                                Marcar leída
                              </Button>
                            )}

                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteNotification(notification.id)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  )
}
