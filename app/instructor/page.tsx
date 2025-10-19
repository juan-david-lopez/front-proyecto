// app/instructor/page.tsx
"use client"

import { useAuth } from "@/contexts/auth-context"
import { useNavigation } from "@/hooks/use-navigation"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Users, 
  Calendar, 
  Clock, 
  CheckSquare,
  MapPin,
  UserCheck,
  CalendarPlus,
  Settings,
  LogOut,
  ArrowLeft,
  GraduationCap,
  Activity,
  BarChart3,
  TrendingUp,
  Star,
  Award,
  Target,
  Zap
} from "lucide-react"
import { InstructorService } from "@/services/workerService"
import { MyClass, ClassAttendance, MemberAttendance, TimeSlot } from "@/types/worker"

export default function InstructorDashboard() {
  const { user, logout } = useAuth()
  const { goBack } = useNavigation()
  const [selectedTab, setSelectedTab] = useState("clases")
  const [myClasses, setMyClasses] = useState<MyClass[]>([])
  const [selectedClass, setSelectedClass] = useState<MyClass | null>(null)
  const [attendance, setAttendance] = useState<MemberAttendance[]>([])
  const [loading, setLoading] = useState(false)
  const [availability, setAvailability] = useState<{[date: string]: TimeSlot[]}>({})
  const [stats, setStats] = useState({
    totalClasses: 0,
    activeStudents: 0,
    completedClasses: 0,
    averageRating: 4.8
  })

  useEffect(() => {
    if (user?.workerProfile) {
      loadMyClasses()
    }
  }, [user])

  const loadMyClasses = async () => {
    setLoading(true)
    try {
      const instructorId = parseInt(user?.id || "0")
      const classes = await InstructorService.getMyClasses(instructorId)
      setMyClasses(classes)
    } catch (error) {
      console.error('Error loading classes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectClass = (classData: MyClass) => {
    setSelectedClass(classData)
    // Inicializar lista de asistencia
    const attendanceList: MemberAttendance[] = classData.reservedMembers.map(member => ({
      memberId: member.id,
      memberName: member.name,
      reservationId: parseInt(member.id.toString()),
      attended: false,
      notes: ""
    }))
    setAttendance(attendanceList)
  }

  const handleAttendanceChange = (memberId: number, attended: boolean) => {
    setAttendance(prev => 
      prev.map(item => 
        item.memberId === memberId 
          ? { ...item, attended }
          : item
      )
    )
  }

  const handleSaveAttendance = async () => {
    if (!selectedClass) return

    setLoading(true)
    try {
      const attendanceData: ClassAttendance = {
        classId: selectedClass.id,
        attendanceDate: selectedClass.date,
        members: attendance
      }
      
      await InstructorService.recordAttendance(attendanceData)
      alert("Asistencia registrada exitosamente")
    } catch (error) {
      console.error('Error saving attendance:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateAvailability = async (date: string, slots: TimeSlot[]) => {
    setLoading(true)
    try {
      const instructorId = parseInt(user?.id || "0")
      await InstructorService.updateAvailability({
        instructorId,
        date,
        availableSlots: slots
      })
      
      setAvailability(prev => ({
        ...prev,
        [date]: slots
      }))
      
      alert("Disponibilidad actualizada exitosamente")
    } catch (error) {
      console.error('Error updating availability:', error)
    } finally {
      setLoading(false)
    }
  }

  const addTimeSlot = (date: string) => {
    const currentSlots = availability[date] || []
    const newSlot: TimeSlot = {
      startTime: "09:00",
      endTime: "10:00",
      isAvailable: true
    }
    
    setAvailability(prev => ({
      ...prev,
      [date]: [...currentSlots, newSlot]
    }))
  }

  const removeTimeSlot = (date: string, index: number) => {
    const currentSlots = availability[date] || []
    const updatedSlots = currentSlots.filter((_, i) => i !== index)
    
    setAvailability(prev => ({
      ...prev,
      [date]: updatedSlots
    }))
  }

  const updateTimeSlot = (date: string, index: number, field: keyof TimeSlot, value: any) => {
    const currentSlots = availability[date] || []
    const updatedSlots = currentSlots.map((slot, i) => 
      i === index ? { ...slot, [field]: value } : slot
    )
    
    setAvailability(prev => ({
      ...prev,
      [date]: updatedSlots
    }))
  }

  if (!user || user.role !== 'INSTRUCTOR') {
    return <div>Acceso no autorizado</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-gray-100">
      {/* Header Premium */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Instructor</h1>
                <p className="text-sm text-gray-500">Gestiona tus clases y estudiantes</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 px-4 py-2 bg-orange-50 rounded-lg border border-orange-200">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">{user.name}</span>
                  <Badge className="text-xs bg-orange-100 text-orange-700 border-orange-200">
                    Instructor
                  </Badge>
                </div>
              </div>
              
              {user.workerProfile?.specialties && (
                <div className="flex flex-wrap gap-1">
                  {user.workerProfile.specialties.map((specialty, index) => (
                    <Badge key={index} variant="outline" className="text-xs border-orange-300 text-orange-700">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              )}
              
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
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600 mb-1">Clases Totales</p>
                  <p className="text-3xl font-bold text-orange-900">{myClasses.length}</p>
                </div>
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 mb-1">Estudiantes Activos</p>
                  <p className="text-3xl font-bold text-blue-900">{stats.activeStudents}</p>
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
                  <p className="text-sm font-medium text-green-600 mb-1">Clases Completadas</p>
                  <p className="text-3xl font-bold text-green-900">{stats.completedClasses}</p>
                </div>
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <CheckSquare className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600 mb-1">Calificación Promedio</p>
                  <p className="text-3xl font-bold text-yellow-900">{stats.averageRating.toFixed(1)}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
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
                variant={selectedTab === "clases" ? "default" : "outline"}
                onClick={() => setSelectedTab("clases")}
                className={`flex items-center gap-2 transition-all duration-200 ${
                  selectedTab === "clases" 
                    ? "bg-orange-600 hover:bg-orange-700 text-white shadow-lg" 
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Calendar className="h-4 w-4" />
                Mis Clases
              </Button>
              
              <Button 
                variant={selectedTab === "asistencia" ? "default" : "outline"}
                onClick={() => setSelectedTab("asistencia")}
                className={`flex items-center gap-2 transition-all duration-200 ${
                  selectedTab === "asistencia" 
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg" 
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <UserCheck className="h-4 w-4" />
                Registro de Asistencia
              </Button>
              
              <Button 
                variant={selectedTab === "disponibilidad" ? "default" : "outline"}
                onClick={() => setSelectedTab("disponibilidad")}
                className={`flex items-center gap-2 transition-all duration-200 ${
                  selectedTab === "disponibilidad" 
                    ? "bg-green-600 hover:bg-green-700 text-white shadow-lg" 
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <CalendarPlus className="h-4 w-4" />
                Gestión de Disponibilidad
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Vista de Mis Clases */}
        {selectedTab === "clases" && (
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-orange-50 to-white border-orange-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-t-lg">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-white">Mis Clases Programadas</CardTitle>
                      <p className="text-orange-100 text-sm">Gestiona tus clases y estudiantes</p>
                    </div>
                  </div>
                  <Button 
                    onClick={loadMyClasses} 
                    disabled={loading}
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    <Activity className="h-4 w-4 mr-2" />
                    {loading ? 'Cargando...' : 'Actualizar'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {myClasses.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="h-12 w-12 text-orange-500" />
                    </div>
                    <p className="text-gray-600 text-lg mb-2">No tienes clases programadas</p>
                    <p className="text-gray-500 text-sm">Las clases asignadas aparecerán aquí</p>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {myClasses.map((classData) => (
                      <Card key={classData.id} 
                            className="cursor-pointer hover:shadow-xl transition-all duration-300 border-orange-200 hover:border-orange-400 bg-gradient-to-r from-white to-orange-50"
                            onClick={() => handleSelectClass(classData)}>
                        <CardHeader className="pb-4">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                                <GraduationCap className="w-6 h-6" />
                              </div>
                              <div>
                                <CardTitle className="text-xl text-gray-900">{classData.name}</CardTitle>
                                <p className="text-sm text-orange-600 capitalize font-medium">{classData.type}</p>
                              </div>
                            </div>
                            <Badge 
                              variant={classData.currentReservations === classData.maxCapacity ? "destructive" : "default"}
                              className="text-sm px-3 py-1"
                            >
                              {classData.currentReservations}/{classData.maxCapacity} estudiantes
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-orange-100">
                              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                <Calendar className="h-4 w-4 text-orange-600" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 font-medium">FECHA</p>
                                <p className="font-bold text-gray-900">
                                  {new Date(classData.date).toLocaleDateString('es-ES', {
                                    weekday: 'short',
                                    day: 'numeric',
                                    month: 'short'
                                  })}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-orange-100">
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Clock className="h-4 w-4 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 font-medium">HORARIO</p>
                                <p className="font-bold text-gray-900">{classData.startTime} - {classData.endTime}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-orange-100">
                              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                <MapPin className="h-4 w-4 text-green-600" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 font-medium">UBICACIÓN</p>
                                <p className="font-bold text-gray-900">{classData.location}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4 pt-4 border-t border-orange-100">
                            <div className="flex items-center justify-between">
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Estudiantes registrados:</span> {classData.reservedMembers?.length || 0}
                              </p>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="border-orange-300 text-orange-700 hover:bg-orange-50"
                              >
                                Ver detalles
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Vista de Registro de Asistencia */}
        {selectedTab === "asistencia" && (
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-white">Registro de Asistencia</CardTitle>
                    <p className="text-blue-100 text-sm">Controla la asistencia de tus estudiantes</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {!selectedClass ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <UserCheck className="h-12 w-12 text-blue-500" />
                    </div>
                    <p className="text-gray-600 text-lg mb-2">Selecciona una clase para registrar asistencia</p>
                    <p className="text-gray-500 text-sm mb-6">Primero debes elegir una clase desde "Mis Clases"</p>
                    <Button 
                      onClick={() => setSelectedTab("clases")}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Ver Mis Clases
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Info de la clase seleccionada */}
                    <div className="bg-gradient-to-r from-blue-50 to-white p-4 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                          <GraduationCap className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-xl text-blue-900">{selectedClass.name}</h3>
                          <p className="text-blue-600 text-sm">
                            {new Date(selectedClass.date).toLocaleDateString('es-ES', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })} • {selectedClass.startTime} - {selectedClass.endTime}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Lista de estudiantes */}
                    <div>
                      <h4 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-600" />
                        Estudiantes Registrados ({attendance.length})
                      </h4>
                      
                      <div className="space-y-3">
                        {attendance.map((member) => (
                          <div key={member.memberId} 
                               className={`p-4 rounded-xl border transition-all duration-200 ${
                                 member.attended 
                                   ? 'bg-green-50 border-green-200 shadow-sm' 
                                   : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm'
                               }`}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                                  member.attended ? 'bg-green-500' : 'bg-gray-400'
                                }`}>
                                  {member.memberName.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{member.memberName}</p>
                                  <p className="text-sm text-gray-500">ID: {member.memberId}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <Checkbox
                                  id={`attendance-${member.memberId}`}
                                  checked={member.attended}
                                  onCheckedChange={(checked) => 
                                    handleAttendanceChange(member.memberId, checked as boolean)
                                  }
                                  className="w-5 h-5"
                                />
                                <label 
                                  htmlFor={`attendance-${member.memberId}`}
                                  className={`text-sm font-medium cursor-pointer ${
                                    member.attended ? 'text-green-700' : 'text-gray-600'
                                  }`}
                                >
                                  {member.attended ? 'Presente' : 'Ausente'}
                                </label>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Botón de guardar */}
                    <div className="flex gap-4">
                      <Button 
                        onClick={handleSaveAttendance}
                        disabled={loading}
                        className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-lg shadow-lg"
                      >
                        <CheckSquare className="h-5 w-5 mr-2" />
                        {loading ? 'Guardando...' : 'Guardar Asistencia'}
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => setSelectedClass(null)}
                        className="px-6 border-blue-300 text-blue-700 hover:bg-blue-50"
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Cambiar Clase
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

      {/* Vista de Gestión de Disponibilidad */}
      {selectedTab === "disponibilidad" && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Gestión de Disponibilidad</h2>
          <p className="text-gray-600">
            Configura tus horarios disponibles para entrenamientos personales
          </p>
          
          {/* Selector de fecha */}
          <Card>
            <CardHeader>
              <CardTitle>Configurar Disponibilidad</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Aquí irían los próximos 7 días */}
              {[0, 1, 2, 3, 4, 5, 6].map(offset => {
                const date = new Date()
                date.setDate(date.getDate() + offset)
                const dateStr = date.toISOString().split('T')[0]
                const daySlots = availability[dateStr] || []
                
                return (
                  <div key={dateStr} className="border rounded p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium">
                        {date.toLocaleDateString('es-ES', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </h4>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => addTimeSlot(dateStr)}
                      >
                        Agregar Horario
                      </Button>
                    </div>
                    
                    {daySlots.length === 0 ? (
                      <p className="text-gray-500 text-sm">No hay horarios configurados</p>
                    ) : (
                      <div className="space-y-2">
                        {daySlots.map((slot, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <input
                              type="time"
                              value={slot.startTime}
                              onChange={(e) => updateTimeSlot(dateStr, index, 'startTime', e.target.value)}
                              className="p-1 border rounded"
                            />
                            <span>-</span>
                            <input
                              type="time"
                              value={slot.endTime}
                              onChange={(e) => updateTimeSlot(dateStr, index, 'endTime', e.target.value)}
                              className="p-1 border rounded"
                            />
                            <Checkbox
                              checked={slot.isAvailable}
                              onCheckedChange={(checked) => 
                                updateTimeSlot(dateStr, index, 'isAvailable', checked)
                              }
                            />
                            <span className="text-sm">Disponible</span>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => removeTimeSlot(dateStr, index)}
                            >
                              Eliminar
                            </Button>
                          </div>
                        ))}
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => handleUpdateAvailability(dateStr, daySlots)}
                          disabled={loading}
                        >
                          Guardar Cambios
                        </Button>
                      </div>
                    )}
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>
      )}
      </div>
    </div>
  )
}