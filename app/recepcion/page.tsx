// app/recepcion/page.tsx
"use client"

import { useAuth } from "@/contexts/auth-context"
import { useNavigation } from "@/hooks/use-navigation"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  UserPlus, 
  CreditCard, 
  Users, 
  CheckCircle, 
  Search,
  DollarSign,
  Calendar,
  LogOut,
  ArrowLeft,
  Activity,
  Clock,
  AlertCircle,
  TrendingUp,
  UserCheck,
  Zap,
  BarChart3,
  Mail
} from "lucide-react"
import { ReceptionistService } from "@/services/workerService"
import { CheckInRequest, PaymentProcessRequest } from "@/types/worker"

export default function ReceptionDashboard() {
  const { user, hasPermission, logout } = useAuth()
  const { goBack } = useNavigation()
  const [selectedTab, setSelectedTab] = useState("checkin")
  const [memberSearch, setMemberSearch] = useState("")
  const [memberInfo, setMemberInfo] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({
    todayCheckIns: 0,
    activeMembers: 0,
    pendingPayments: 0,
    revenue: 0
  })
  const [recentActivity, setRecentActivity] = useState<any[]>([])

  // Estados para check-in
  const [checkInResult, setCheckInResult] = useState<any>(null)

  // Estados para registro de miembro
  const [newMember, setNewMember] = useState({
    firstName: "",
    lastName: "",
    email: "",
    documentNumber: "",
    phoneNumber: "",
    membershipType: "basico"
  })

  // Estados para pagos
  const [paymentData, setPaymentData] = useState({
    memberId: 0,
    amount: 0,
    paymentType: "membership_renewal" as const,
    paymentMethod: "card" as const
  })

  const handleMemberSearch = async () => {
    if (!memberSearch.trim()) return
    
    setLoading(true)
    try {
      const memberId = parseInt(memberSearch)
      if (isNaN(memberId)) {
        // Buscar por email o nombre (simulación)
        setMemberInfo({
          id: 1,
          name: "Juan Pérez",
          email: "juan@email.com",
          membershipType: "Premium",
          membershipStatus: "active",
          lastAccess: "2024-01-14 08:30"
        })
      } else {
        const result = await ReceptionistService.getMemberInfo(memberId)
        setMemberInfo(result)
      }
    } catch (error) {
      console.error('Error searching member:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCheckIn = async () => {
    if (!memberInfo) return

    setLoading(true)
    try {
      const checkInRequest: CheckInRequest = {
        memberId: memberInfo.id,
        accessType: 'gym'
      }
      
      const result = await ReceptionistService.processCheckIn(checkInRequest)
      setCheckInResult(result)
    } catch (error) {
      console.error('Error processing check-in:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleNewMemberRegistration = async () => {
    if (!hasPermission('members', 'create')) return

    setLoading(true)
    try {
      const result = await ReceptionistService.registerNewMember(newMember)
      if (result.success) {
        alert("Miembro registrado exitosamente")
        setNewMember({
          firstName: "",
          lastName: "",
          email: "",
          documentNumber: "",
          phoneNumber: "",
          membershipType: "basico"
        })
      }
    } catch (error) {
      console.error('Error registering member:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = async () => {
    if (!hasPermission('payments', 'create')) return

    setLoading(true)
    try {
      const result = await ReceptionistService.processPayment(paymentData)
      if (result.success) {
        alert(`Pago procesado exitosamente. ID: ${result.paymentId}`)
      }
    } catch (error) {
      console.error('Error processing payment:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!user || user.role !== 'RECEPTIONIST') {
    return <div>Acceso no autorizado</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      {/* Header mejorado */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Recepción</h1>
                <p className="text-sm text-gray-500">Gestiona check-ins, registros y pagos</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">{user.name}</span>
                  <Badge className="text-xs bg-blue-100 text-blue-700 border-blue-200">
                    Recepcionista
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goBack}
                  className="border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar Sesión
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Dashboard Stats mejorado */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 mb-1">Check-ins Hoy</p>
                  <p className="text-3xl font-bold text-blue-900">{stats.todayCheckIns}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 mb-1">Miembros Activos</p>
                  <p className="text-3xl font-bold text-green-900">{stats.activeMembers}</p>
                </div>
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600 mb-1">Pagos Pendientes</p>
                  <p className="text-3xl font-bold text-yellow-900">{stats.pendingPayments}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 mb-1">Ingresos Hoy</p>
                  <p className="text-3xl font-bold text-purple-900">${stats.revenue.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navegación de tabs mejorada */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={selectedTab === "checkin" ? "default" : "outline"}
                onClick={() => setSelectedTab("checkin")}
                className={`flex items-center gap-2 transition-all duration-200 ${
                  selectedTab === "checkin" 
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg" 
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <CheckCircle className="h-4 w-4" />
                Check-in de Miembros
              </Button>
              
              {hasPermission('members', 'create') && (
                <Button 
                  variant={selectedTab === "registro" ? "default" : "outline"}
                  onClick={() => setSelectedTab("registro")}
                  className={`flex items-center gap-2 transition-all duration-200 ${
                    selectedTab === "registro" 
                      ? "bg-green-600 hover:bg-green-700 text-white shadow-lg" 
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <UserPlus className="h-4 w-4" />
                  Registro de Miembros
                </Button>
              )}
              
              {hasPermission('payments', 'create') && (
                <Button 
                  variant={selectedTab === "pagos" ? "default" : "outline"}
                  onClick={() => setSelectedTab("pagos")}
                  className={`flex items-center gap-2 transition-all duration-200 ${
                    selectedTab === "pagos" 
                      ? "bg-purple-600 hover:bg-purple-700 text-white shadow-lg" 
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <CreditCard className="h-4 w-4" />
                  Procesamiento de Pagos
                </Button>
              )}
              
                <Button 
                  variant={selectedTab === "reservas" ? "default" : "outline"}
                  onClick={() => setSelectedTab("reservas")}
                  className={`flex items-center gap-2 transition-all duration-200 ${
                    selectedTab === "reservas" 
                      ? "bg-orange-600 hover:bg-orange-700 text-white shadow-lg" 
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Calendar className="h-4 w-4" />
                  Gestión de Reservas
                </Button>
              </div>
            </CardContent>
          </Card>

        {/* Contenido según el tab seleccionado */}
        {selectedTab === "checkin" && (
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-white">Control de Acceso - Check-in</CardTitle>
                    <p className="text-blue-100 text-sm">Registra la entrada de miembros al gimnasio</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <Label className="text-blue-900 font-medium">ID del Miembro / Email</Label>
                      <Input
                        type="text"
                        placeholder="Ingrese ID o email del miembro"
                        value={memberSearch}
                        className="mt-1 border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                        onChange={(e) => setMemberSearch(e.target.value)}
                      />
                    </div>
                    <Button 
                      onClick={handleMemberSearch}
                      disabled={loading}
                      className="bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                    >
                      <Search className="h-4 w-4 mr-2" />
                      {loading ? 'Buscando...' : 'Buscar Miembro'}
                    </Button>
                  </div>
                </div>

                {memberInfo && (
                  <Card className="bg-gradient-to-br from-green-50 to-white border-green-200 shadow-md">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                            {memberInfo.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-bold text-xl text-gray-900">{memberInfo.name}</h3>
                            <p className="text-gray-600 flex items-center gap-2 mt-1">
                              <Mail className="w-4 h-4" />
                              {memberInfo.email}
                            </p>
                          </div>
                        </div>
                        <Badge 
                          variant={memberInfo.membershipStatus === 'active' ? 'default' : 'destructive'}
                          className={`text-sm px-3 py-1 ${
                            memberInfo.membershipStatus === 'active' 
                              ? 'bg-green-100 text-green-800 border-green-300' 
                              : 'bg-red-100 text-red-800 border-red-300'
                          }`}
                        >
                          {memberInfo.membershipStatus === 'active' ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-white p-4 rounded-lg border border-green-200">
                          <div className="flex items-center gap-2 mb-2">
                            <CreditCard className="w-4 h-4 text-green-600" />
                            <span className="font-medium text-gray-700">Tipo de Membresía</span>
                          </div>
                          <p className="text-lg font-bold text-green-800">{memberInfo.membershipType}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-green-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="w-4 h-4 text-green-600" />
                            <span className="font-medium text-gray-700">Último Check-in</span>
                          </div>
                          <p className="text-lg font-bold text-green-800">{memberInfo.lastAccess || 'Primer acceso'}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-4">
                        <Button 
                          onClick={handleCheckIn}
                          disabled={loading || memberInfo.membershipStatus !== 'active'}
                          className={`flex-1 h-12 text-lg font-semibold ${
                            memberInfo.membershipStatus === 'active'
                              ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          <CheckCircle className="h-5 w-5 mr-2" />
                          {memberInfo.membershipStatus === 'active' ? 'Autorizar Acceso' : 'Membresía Inactiva'}
                        </Button>
                        
                        <Button
                          variant="outline" 
                          onClick={() => setMemberInfo(null)}
                          className="px-6 border-green-300 text-green-700 hover:bg-green-50"
                        >
                          <Search className="h-4 w-4 mr-2" />
                          Nueva Búsqueda
                        </Button>
                      </div>
                  </CardContent>
                </Card>
              )}

                {checkInResult && (
                  <Card className={`${
                    checkInResult.success 
                      ? "bg-gradient-to-r from-green-50 to-green-100 border-green-200 shadow-lg" 
                      : "bg-gradient-to-r from-red-50 to-red-100 border-red-200 shadow-lg"
                  }`}>
                    <CardContent className="p-6">
                      <div className={`flex items-center gap-3 ${
                        checkInResult.success ? "text-green-800" : "text-red-800"
                      }`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          checkInResult.success 
                            ? "bg-green-200 text-green-800" 
                            : "bg-red-200 text-red-800"
                        }`}>
                          {checkInResult.success ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <AlertCircle className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-lg">
                            {checkInResult.success ? '¡Check-in Exitoso!' : 'Error en Check-in'}
                          </p>
                          <p className="text-sm opacity-80">
                            {checkInResult.message}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
            </CardContent>
          </Card>
        </div>
      )}

      {selectedTab === "registro" && hasPermission('members', 'create') && (
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-green-50 to-white border-green-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-white">Registro de Nuevo Miembro</CardTitle>
                  <p className="text-green-100 text-sm">Complete los datos del nuevo miembro</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-green-900 font-medium">Nombre</Label>
                  <Input
                    type="text"
                    placeholder="Ingrese el nombre"
                    value={newMember.firstName}
                    onChange={(e) => setNewMember({...newMember, firstName: e.target.value})}
                    className="border-green-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-green-900 font-medium">Apellido</Label>
                  <Input
                    type="text"
                    placeholder="Ingrese el apellido"
                    value={newMember.lastName}
                    onChange={(e) => setNewMember({...newMember, lastName: e.target.value})}
                    className="border-green-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-green-900 font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  <Input
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={newMember.email}
                    onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                    className="border-green-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-green-900 font-medium">Documento de Identidad</Label>
                  <Input
                    type="text"
                    placeholder="Número de documento"
                    value={newMember.documentNumber}
                    onChange={(e) => setNewMember({...newMember, documentNumber: e.target.value})}
                    className="border-green-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-green-900 font-medium">Teléfono</Label>
                  <Input
                    type="text"
                    placeholder="Número de teléfono"
                    value={newMember.phoneNumber}
                    onChange={(e) => setNewMember({...newMember, phoneNumber: e.target.value})}
                    className="border-green-300 focus:border-green-500 focus:ring-green-500"
                  />
              </div>
              <div>
                <Label>Tipo de Membresía</Label>
                <select 
                  className="w-full p-2 border rounded"
                  value={newMember.membershipType}
                  onChange={(e) => setNewMember({...newMember, membershipType: e.target.value})}
                >
                  <option value="basico">Básico</option>
                  <option value="premium">Premium</option>
                  <option value="elite">Elite</option>
                </select>
              </div>
            </div>
              <div className="pt-4">
                <Button 
                  onClick={handleNewMemberRegistration}
                  disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold text-lg shadow-lg"
                >
                  <UserPlus className="h-5 w-5 mr-2" />
                  {loading ? 'Registrando...' : 'Registrar Nuevo Miembro'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedTab === "pagos" && hasPermission('payments', 'create') && (
        <Card>
          <CardHeader>
            <CardTitle>Procesamiento de Pagos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>ID del Miembro</Label>
                <Input
                  type="number"
                  value={paymentData.memberId || ""}
                  onChange={(e) => setPaymentData({...paymentData, memberId: parseInt(e.target.value) || 0})}
                />
              </div>
              <div>
                <Label>Monto</Label>
                <Input
                  type="number"
                  value={paymentData.amount || ""}
                  onChange={(e) => setPaymentData({...paymentData, amount: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div>
                <Label>Tipo de Pago</Label>
                <select 
                  className="w-full p-2 border rounded"
                  value={paymentData.paymentType}
                  onChange={(e) => setPaymentData({...paymentData, paymentType: e.target.value as any})}
                >
                  <option value="membership_renewal">Renovación Membresía</option>
                  <option value="new_membership">Nueva Membresía</option>
                  <option value="personal_training">Entrenamiento Personal</option>
                  <option value="additional_service">Servicio Adicional</option>
                </select>
              </div>
              <div>
                <Label>Método de Pago</Label>
                <select 
                  className="w-full p-2 border rounded"
                  value={paymentData.paymentMethod}
                  onChange={(e) => setPaymentData({...paymentData, paymentMethod: e.target.value as any})}
                >
                  <option value="card">Tarjeta</option>
                  <option value="cash">Efectivo</option>
                  <option value="transfer">Transferencia</option>
                </select>
              </div>
            </div>
            <Button 
              onClick={handlePayment}
              disabled={loading}
              className="w-full"
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Procesar Pago
            </Button>
          </CardContent>
        </Card>
      )}

      {selectedTab === "reservas" && (
        <Card>
          <CardHeader>
            <CardTitle>Gestión de Reservas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Funcionalidad para ayudar a los miembros con sus reservas y cancelaciones.
            </p>
            <Button variant="outline" onClick={() => window.open('/reservas', '_blank')}>
              <Calendar className="h-4 w-4 mr-2" />
              Abrir Sistema de Reservas
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
    </div>
  )
}