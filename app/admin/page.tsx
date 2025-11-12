// app/admin/page.tsx
"use client"

import { useAuth } from "@/contexts/auth-context"
import { useNavigation } from "@/hooks/use-navigation"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { 
  Settings, 
  Users, 
  BarChart3, 
  MapPin,
  CreditCard,
  Trophy,
  UserPlus,
  Edit,
  Trash2,
  DollarSign,
  TrendingUp,
  Clock,
  Target,
  LogOut,
  ArrowLeft,
  Shield,
  Activity,
  Calendar,
  Star,
  Award,
  Building,
  Zap,
  PieChart,
  BarChart,
  LineChart
} from "lucide-react"
import { AdminService } from "@/services/workerService"
import { 
  BusinessConfig, 
  KPIReport, 
  WorkerProfile, 
  GymLocation,
  MembershipTypeConfig,
  ClassTypeConfig 
} from "@/types/worker"

export default function AdminDashboard() {
  const { user, hasPermission, logout } = useAuth()
  const { goBack } = useNavigation()
  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState("kpis")
  const [loading, setLoading] = useState(false)
  
  // Estados para configuración
  const [businessConfig, setBusinessConfig] = useState<BusinessConfig | null>(null)
  
  // Estados para KPIs
  const [kpiReport, setKpiReport] = useState<KPIReport | null>(null)
  const [reportPeriod, setReportPeriod] = useState("monthly")
  const [dashboardStats, setDashboardStats] = useState({
    totalMembers: 0,
    totalRevenue: 0,
    activeWorkers: 0,
    completedClasses: 0,
    monthlyGrowth: 0
  })
  
  // Estados para workers
  const [workers, setWorkers] = useState<WorkerProfile[]>([])
  const [newWorker, setNewWorker] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "RECEPTIONIST" as const,
    specialties: ""
  })

  // Estados para ubicaciones
  const [newLocation, setNewLocation] = useState({
    name: "",
    address: "",
    capacity: 0,
    facilities: ""
  })

  // Estados para tipos de membresía
  const [newMembershipType, setNewMembershipType] = useState({
    name: "",
    price: 0,
    duration: 30,
    benefits: "",
    maxReservations: 3,
    accessToSpecializedSpaces: false,
    personalTrainingSessions: 0
  })

  // Protección: Redirigir usuarios no administradores al dashboard de miembro
  useEffect(() => {
    if (user && user.role !== 'ADMIN') {
      console.log('⚠️ [AdminDashboard] Usuario no autorizado, redirigiendo a /dashboard')
      router.push('/dashboard')
    }
  }, [user?.role, router])

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      loadKPIReport()
      loadBusinessConfig()
      loadWorkers()
    }
  }, [user])

  const loadKPIReport = async () => {
    setLoading(true)
    try {
      const endDate = new Date().toISOString().split('T')[0]
      const startDate = new Date()
      startDate.setMonth(startDate.getMonth() - 1)
      
      const report = await AdminService.getKPIReport(reportPeriod, startDate.toISOString().split('T')[0], endDate)
      setKpiReport(report)
    } catch (error) {
      console.error('Error loading KPI report:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadBusinessConfig = async () => {
    try {
      const config = await AdminService.getBusinessConfig()
      setBusinessConfig(config)
    } catch (error) {
      console.error('Error loading business config:', error)
    }
  }

  const loadWorkers = async () => {
    try {
      const workersData = await AdminService.getWorkers()
      setWorkers(workersData)
    } catch (error) {
      console.error('Error loading workers:', error)
    }
  }

  const handleSaveBusinessConfig = async () => {
    if (!businessConfig) return
    
    setLoading(true)
    try {
      await AdminService.updateBusinessConfig(businessConfig)
      alert("Configuración guardada exitosamente")
    } catch (error) {
      console.error('Error saving config:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateWorker = async () => {
    if (!hasPermission('workers', 'create')) return
    
    setLoading(true)
    try {
      const workerData = {
        ...newWorker,
        specialties: newWorker.specialties.split(',').map(s => s.trim()).filter(s => s)
      }
      
      await AdminService.createWorker(workerData)
      alert("Worker creado exitosamente")
      setNewWorker({
        firstName: "",
        lastName: "",
        email: "",
        role: "RECEPTIONIST",
        specialties: ""
      })
      loadWorkers()
    } catch (error) {
      console.error('Error creating worker:', error)
    } finally {
      setLoading(false)
    }
  }

  const addLocation = () => {
    if (!businessConfig || !newLocation.name.trim()) return
    
    const location: GymLocation = {
      id: Date.now(),
      name: newLocation.name,
      address: newLocation.address,
      capacity: newLocation.capacity,
      facilities: newLocation.facilities.split(',').map(f => f.trim()).filter(f => f),
      isActive: true
    }
    
    setBusinessConfig({
      ...businessConfig,
      locations: [...businessConfig.locations, location]
    })
    
    setNewLocation({
      name: "",
      address: "",
      capacity: 0,
      facilities: ""
    })
  }

  const addMembershipType = () => {
    if (!businessConfig || !newMembershipType.name.trim()) return
    
    const membershipType: MembershipTypeConfig = {
      id: Date.now(),
      name: newMembershipType.name,
      price: newMembershipType.price,
      duration: newMembershipType.duration,
      benefits: newMembershipType.benefits.split(',').map(b => b.trim()).filter(b => b),
      maxReservations: newMembershipType.maxReservations,
      accessToSpecializedSpaces: newMembershipType.accessToSpecializedSpaces,
      personalTrainingSessions: newMembershipType.personalTrainingSessions
    }
    
    setBusinessConfig({
      ...businessConfig,
      membershipTypes: [...businessConfig.membershipTypes, membershipType]
    })
    
    setNewMembershipType({
      name: "",
      price: 0,
      duration: 30,
      benefits: "",
      maxReservations: 3,
      accessToSpecializedSpaces: false,
      personalTrainingSessions: 0
    })
  }

  if (!user || user.role !== 'ADMIN') {
    return <div>Acceso no autorizado</div>
  }

  // Mostrar pantalla de carga mientras se verifica el rol
  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando permisos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-gray-100">
      {/* Header Premium */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Administrador</h1>
                <p className="text-sm text-gray-500">Control total del sistema FitZone</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 px-4 py-2 bg-purple-50 rounded-lg border border-purple-200">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">{user.name}</span>
                  <Badge className="text-xs bg-purple-100 text-purple-700 border-purple-200">
                    Administrador
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
        {/* Dashboard Stats Executive */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 mb-1">Total Miembros</p>
                  <p className="text-3xl font-bold text-blue-900">{dashboardStats.totalMembers}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 mb-1">Ingresos Totales</p>
                  <p className="text-3xl font-bold text-green-900">${dashboardStats.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600 mb-1">Staff Activo</p>
                  <p className="text-3xl font-bold text-orange-900">{dashboardStats.activeWorkers}</p>
                </div>
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                  <UserPlus className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 mb-1">Clases Completadas</p>
                  <p className="text-3xl font-bold text-purple-900">{dashboardStats.completedClasses}</p>
                </div>
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600 mb-1">Crecimiento Mensual</p>
                  <p className="text-3xl font-bold text-yellow-900">+{dashboardStats.monthlyGrowth}%</p>
                </div>
                <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
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
                variant={selectedTab === "kpis" ? "default" : "outline"}
                onClick={() => setSelectedTab("kpis")}
                className={`flex items-center gap-2 transition-all duration-200 ${
                  selectedTab === "kpis" 
                    ? "bg-purple-600 hover:bg-purple-700 text-white shadow-lg" 
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                Analytics & KPIs
              </Button>
              
              <Button 
                variant={selectedTab === "workers" ? "default" : "outline"}
                onClick={() => setSelectedTab("workers")}
                className={`flex items-center gap-2 transition-all duration-200 ${
                  selectedTab === "workers" 
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg" 
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Users className="h-4 w-4" />
                Gestión de Staff
              </Button>
              
              <Button 
                variant={selectedTab === "configuracion" ? "default" : "outline"}
                onClick={() => setSelectedTab("configuracion")}
                className={`flex items-center gap-2 transition-all duration-200 ${
                  selectedTab === "configuracion" 
                    ? "bg-green-600 hover:bg-green-700 text-white shadow-lg" 
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Settings className="h-4 w-4" />
                Configuración
              </Button>
              
              <Button 
                variant={selectedTab === "ubicaciones" ? "default" : "outline"}
                onClick={() => setSelectedTab("ubicaciones")}
                className={`flex items-center gap-2 transition-all duration-200 ${
                  selectedTab === "ubicaciones" 
                    ? "bg-orange-600 hover:bg-orange-700 text-white shadow-lg" 
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <MapPin className="h-4 w-4" />
                Ubicaciones
              </Button>
              
              <Button 
                variant={selectedTab === "membresias" ? "default" : "outline"}
                onClick={() => setSelectedTab("membresias")}
                className={`flex items-center gap-2 transition-all duration-200 ${
                  selectedTab === "membresias" 
                    ? "bg-yellow-600 hover:bg-yellow-700 text-white shadow-lg" 
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <CreditCard className="h-4 w-4" />
                Tipos de Membresía
              </Button>
            </div>
          </CardContent>
        </Card>

      {/* Vista de KPIs y Reportes */}
      {selectedTab === "kpis" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Indicadores de Rendimiento</h2>
            <div className="flex gap-2">
              <select 
                value={reportPeriod}
                onChange={(e) => setReportPeriod(e.target.value)}
                className="p-2 border rounded"
              >
                <option value="daily">Diario</option>
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensual</option>
                <option value="yearly">Anual</option>
              </select>
              <Button onClick={loadKPIReport} disabled={loading}>
                Actualizar
              </Button>
            </div>
          </div>

          {kpiReport && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Ingresos Totales</p>
                      <p className="text-2xl font-bold">
                        ${kpiReport.metrics.totalRevenue.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <UserPlus className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Nuevos Miembros</p>
                      <p className="text-2xl font-bold">{kpiReport.metrics.newMembers}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600">Retención</p>
                      <p className="text-2xl font-bold">{kpiReport.metrics.memberRetention}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <Target className="h-8 w-8 text-orange-600" />
                    <div>
                      <p className="text-sm text-gray-600">Asistencia a Clases</p>
                      <p className="text-2xl font-bold">{kpiReport.metrics.classAttendance}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {kpiReport && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Clases Populares</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {kpiReport.metrics.popularClasses.map((className, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="capitalize">{className}</span>
                        <Badge variant="outline">{index + 1}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Horarios Pico</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {kpiReport.metrics.peakHours.map((hour, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{hour}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* Vista de Gestión de Workers */}
      {selectedTab === "workers" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Gestión de Workers</h2>
            <Button onClick={loadWorkers} disabled={loading}>
              Actualizar
            </Button>
          </div>

          {/* Formulario para nuevo worker */}
          {hasPermission('workers', 'create') && (
            <Card>
              <CardHeader>
                <CardTitle>Agregar Nuevo Worker</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Nombre</Label>
                    <Input
                      value={newWorker.firstName}
                      onChange={(e) => setNewWorker({...newWorker, firstName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Apellido</Label>
                    <Input
                      value={newWorker.lastName}
                      onChange={(e) => setNewWorker({...newWorker, lastName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={newWorker.email}
                      onChange={(e) => setNewWorker({...newWorker, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Rol</Label>
                    <select 
                      className="w-full p-2 border rounded"
                      value={newWorker.role}
                      onChange={(e) => setNewWorker({...newWorker, role: e.target.value as any})}
                    >
                      <option value="RECEPTIONIST">Recepcionista</option>
                      <option value="INSTRUCTOR">Instructor</option>
                      <option value="ADMIN">Administrador</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <Label>Especialidades (separadas por coma)</Label>
                    <Input
                      value={newWorker.specialties}
                      onChange={(e) => setNewWorker({...newWorker, specialties: e.target.value})}
                      placeholder="yoga, crossfit, aerobics"
                    />
                  </div>
                </div>
                <Button onClick={handleCreateWorker} disabled={loading} className="w-full">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Crear Worker
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Lista de workers */}
          <div className="grid gap-4">
            {workers.map((worker) => (
              <Card key={worker.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{worker.id}</h3>
                      <Badge variant="outline" className="mb-2">
                        {worker.role}
                      </Badge>
                      {worker.specialties && (
                        <p className="text-sm text-gray-600">
                          Especialidades: {worker.specialties.join(", ")}
                        </p>
                      )}
                    </div>
                    <Badge variant={worker.isActive ? "default" : "secondary"}>
                      {worker.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Vista de Configuración General */}
      {selectedTab === "configuracion" && businessConfig && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Configuración del Negocio</h2>
            <Button onClick={handleSaveBusinessConfig} disabled={loading}>
              Guardar Cambios
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Información General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Nombre del Gimnasio</Label>
                <Input
                  value={businessConfig.gymName}
                  onChange={(e) => setBusinessConfig({
                    ...businessConfig,
                    gymName: e.target.value
                  })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reglas de Gamificación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Puntos por Check-in</Label>
                  <Input
                    type="number"
                    value={businessConfig.gamificationRules.pointsPerCheckIn}
                    onChange={(e) => setBusinessConfig({
                      ...businessConfig,
                      gamificationRules: {
                        ...businessConfig.gamificationRules,
                        pointsPerCheckIn: parseInt(e.target.value) || 0
                      }
                    })}
                  />
                </div>
                <div>
                  <Label>Puntos por Clase</Label>
                  <Input
                    type="number"
                    value={businessConfig.gamificationRules.pointsPerClassAttendance}
                    onChange={(e) => setBusinessConfig({
                      ...businessConfig,
                      gamificationRules: {
                        ...businessConfig.gamificationRules,
                        pointsPerClassAttendance: parseInt(e.target.value) || 0
                      }
                    })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Vista de Ubicaciones */}
      {selectedTab === "ubicaciones" && businessConfig && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Gestión de Ubicaciones</h2>

          {/* Formulario para nueva ubicación */}
          <Card>
            <CardHeader>
              <CardTitle>Agregar Nueva Ubicación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nombre</Label>
                  <Input
                    value={newLocation.name}
                    onChange={(e) => setNewLocation({...newLocation, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Capacidad</Label>
                  <Input
                    type="number"
                    value={newLocation.capacity || ""}
                    onChange={(e) => setNewLocation({...newLocation, capacity: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="col-span-2">
                  <Label>Dirección</Label>
                  <Input
                    value={newLocation.address}
                    onChange={(e) => setNewLocation({...newLocation, address: e.target.value})}
                  />
                </div>
                <div className="col-span-2">
                  <Label>Instalaciones (separadas por coma)</Label>
                  <Input
                    value={newLocation.facilities}
                    onChange={(e) => setNewLocation({...newLocation, facilities: e.target.value})}
                    placeholder="Pesas, Cardio, Piscina"
                  />
                </div>
              </div>
              <Button onClick={addLocation} className="w-full">
                <MapPin className="h-4 w-4 mr-2" />
                Agregar Ubicación
              </Button>
            </CardContent>
          </Card>

          {/* Lista de ubicaciones */}
          <div className="grid gap-4">
            {businessConfig.locations.map((location) => (
              <Card key={location.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{location.name}</h3>
                      <p className="text-sm text-gray-600">{location.address}</p>
                      <p className="text-sm">Capacidad: {location.capacity}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {location.facilities.map((facility, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {facility}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Badge variant={location.isActive ? "default" : "secondary"}>
                      {location.isActive ? "Activa" : "Inactiva"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Vista de Tipos de Membresía */}
      {selectedTab === "membresias" && businessConfig && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Gestión de Tipos de Membresía</h2>

          {/* Formulario para nuevo tipo de membresía */}
          <Card>
            <CardHeader>
              <CardTitle>Agregar Nuevo Tipo de Membresía</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nombre</Label>
                  <Input
                    value={newMembershipType.name}
                    onChange={(e) => setNewMembershipType({...newMembershipType, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Precio</Label>
                  <Input
                    type="number"
                    value={newMembershipType.price || ""}
                    onChange={(e) => setNewMembershipType({...newMembershipType, price: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <Label>Duración (días)</Label>
                  <Input
                    type="number"
                    value={newMembershipType.duration || ""}
                    onChange={(e) => setNewMembershipType({...newMembershipType, duration: parseInt(e.target.value) || 30})}
                  />
                </div>
                <div>
                  <Label>Máx. Reservas</Label>
                  <Input
                    type="number"
                    value={newMembershipType.maxReservations || ""}
                    onChange={(e) => setNewMembershipType({...newMembershipType, maxReservations: parseInt(e.target.value) || 3})}
                  />
                </div>
                <div className="col-span-2">
                  <Label>Beneficios (separados por coma)</Label>
                  <Input
                    value={newMembershipType.benefits}
                    onChange={(e) => setNewMembershipType({...newMembershipType, benefits: e.target.value})}
                    placeholder="Acceso a gimnasio, Clases grupales"
                  />
                </div>
              </div>
              <Button onClick={addMembershipType} className="w-full">
                <CreditCard className="h-4 w-4 mr-2" />
                Agregar Tipo de Membresía
              </Button>
            </CardContent>
          </Card>

          {/* Lista de tipos de membresía */}
          <div className="grid gap-4">
            {businessConfig.membershipTypes.map((membershipType) => (
              <Card key={membershipType.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{membershipType.name}</h3>
                      <p className="text-lg font-bold text-green-600">${membershipType.price}</p>
                      <p className="text-sm text-gray-600">{membershipType.duration} días</p>
                      <div className="mt-2">
                        <p className="text-sm font-medium">Beneficios:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {membershipType.benefits.map((benefit, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {benefit}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <p>Máx. reservas: {membershipType.maxReservations}</p>
                      <p>Entrenamientos: {membershipType.personalTrainingSessions}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      </div>
    </div>
  )
}