import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Link2, 
  Briefcase, 
  Database, 
  Users, 
  Tag,
  Facebook,
  ShoppingBag,
  Trash2,
  Plus
} from "lucide-react";
import { SiTiktok } from "react-icons/si";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Workspace, Connection, WorkspaceMember, NomenclatureProperty } from "@shared/schema";

type SettingsSection = 
  | "profile" 
  | "connections" 
  | "workspace" 
  | "data-sources" 
  | "members" 
  | "nomenclature";

const navigationItems = [
  { id: "profile" as SettingsSection, label: "Mi perfil", icon: User },
  { id: "connections" as SettingsSection, label: "Mis conexiones", icon: Link2 },
  { id: "workspace" as SettingsSection, label: "Workspace", icon: Briefcase },
  { id: "data-sources" as SettingsSection, label: "Data sources", icon: Database },
  { id: "members" as SettingsSection, label: "Miembros", icon: Users },
  { id: "nomenclature" as SettingsSection, label: "Nomenclatura", icon: Tag },
];

export default function Settings() {
  const [activeSection, setActiveSection] = useState<SettingsSection>("profile");
  const { toast } = useToast();

  // Fetch current workspace (for now, use the first workspace)
  const { data: workspaces = [] } = useQuery<Workspace[]>({
    queryKey: ["/api/workspaces/all"],
  });
  const currentWorkspace = workspaces[0];

  // Fetch connections for the current workspace
  const { data: connections = [] } = useQuery<Connection[]>({
    queryKey: ["/api/connections", currentWorkspace?.id],
    enabled: !!currentWorkspace?.id,
  });

  // Fetch workspace members
  const { data: members = [] } = useQuery<WorkspaceMember[]>({
    queryKey: ["/api/workspace-members", currentWorkspace?.id],
    enabled: !!currentWorkspace?.id,
  });

  // Fetch nomenclature properties
  const { data: nomenclatureProps = [] } = useQuery<NomenclatureProperty[]>({
    queryKey: ["/api/nomenclature-properties", currentWorkspace?.id],
    enabled: !!currentWorkspace?.id,
  });

  return (
    <div className="flex h-full">
      {/* Left Sidebar Navigation */}
      <div className="w-64 border-r p-6">
        <h2 className="text-lg font-semibold mb-6">Configuración</h2>
        <nav className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                data-testid={`button-settings-${item.id}`}
                onClick={() => setActiveSection(item.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors
                  ${isActive 
                    ? "bg-accent text-accent-foreground font-medium" 
                    : "hover-elevate active-elevate-2"
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label === "Workspace" && currentWorkspace ? currentWorkspace.name : item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8">
          {activeSection === "profile" && <ProfileSection />}
          {activeSection === "connections" && <ConnectionsSection connections={connections} workspaceId={currentWorkspace?.id} />}
          {activeSection === "workspace" && <WorkspaceSection workspace={currentWorkspace} />}
          {activeSection === "data-sources" && <DataSourcesSection connections={connections} />}
          {activeSection === "members" && <MembersSection members={members} workspaceId={currentWorkspace?.id} />}
          {activeSection === "nomenclature" && <NomenclatureSection properties={nomenclatureProps} workspaceId={currentWorkspace?.id} />}
        </div>
      </div>
    </div>
  );
}

// Mi perfil section
function ProfileSection() {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Perfil actualizado",
      description: "Tus cambios han sido guardados exitosamente.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Mi perfil</h1>
        <p className="text-sm text-muted-foreground">
          Gestiona tu información personal y preferencias de cuenta.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información personal</CardTitle>
          <CardDescription>Actualiza tu foto de perfil y datos personales.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-6">
            <Avatar className="w-20 h-20">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>UD</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Button variant="outline" size="sm" data-testid="button-change-avatar">
                Cambiar foto
              </Button>
              <p className="text-xs text-muted-foreground">JPG, PNG o GIF. Máx. 2MB.</p>
            </div>
          </div>

          <Separator />

          {/* Form fields */}
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="profile-name">Nombre completo</Label>
              <Input 
                id="profile-name" 
                data-testid="input-profile-name"
                defaultValue="Usuario Demo" 
                placeholder="Tu nombre completo" 
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="profile-email">Correo electrónico</Label>
              <Input 
                id="profile-email" 
                data-testid="input-profile-email"
                type="email" 
                defaultValue="demo@example.com" 
                placeholder="tu@correo.com" 
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="profile-role">Rol</Label>
              <Input 
                id="profile-role" 
                data-testid="input-profile-role"
                defaultValue="Admin" 
                disabled 
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave} data-testid="button-save-profile">
              Guardar cambios
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Mis conexiones section
function ConnectionsSection({ connections, workspaceId }: { connections: Connection[], workspaceId?: string }) {
  const { toast } = useToast();

  const connectedAccounts = connections.filter(c => c.status === "connected");
  const availableAccounts = [
    { 
      id: "meta", 
      name: "Meta (Facebook & Instagram)", 
      icon: Facebook,
      description: "Conecta tus cuentas publicitarias de Meta"
    },
    { 
      id: "tiktok", 
      name: "TikTok Ads", 
      icon: SiTiktok,
      description: "Sincroniza campañas de TikTok"
    },
    { 
      id: "shopify", 
      name: "Shopify", 
      icon: ShoppingBag,
      description: "Importa datos de tu tienda"
    },
    { 
      id: "tiendanube", 
      name: "Tienda Nube", 
      icon: ShoppingBag,
      description: "Conecta tu tienda en Latinoamérica"
    },
  ];

  const handleConnect = (accountId: string) => {
    toast({
      title: "Conexión en proceso",
      description: `Conectando con ${accountId}...`,
    });
  };

  const handleDisconnect = (connectionId: string) => {
    toast({
      title: "Cuenta desconectada",
      description: "La conexión ha sido removida exitosamente.",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Mis conexiones</h1>
        <p className="text-sm text-muted-foreground">
          Gestiona las cuentas y plataformas conectadas a tu workspace.
        </p>
      </div>

      {/* Connected accounts */}
      {connectedAccounts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Cuentas conectadas</CardTitle>
            <CardDescription>Plataformas actualmente vinculadas a tu workspace.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {connectedAccounts.map((connection) => {
              const accountConfig = availableAccounts.find(a => a.id === connection.platform);
              const Icon = accountConfig?.icon || Link2;
              
              return (
                <div 
                  key={connection.id} 
                  className="flex items-center justify-between p-4 border rounded-lg"
                  data-testid={`connection-${connection.platform}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{accountConfig?.name || connection.platform}</p>
                        <Badge variant="secondary" className="text-xs">Conectado</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{connection.accountName || connection.accountId}</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    data-testid={`button-disconnect-${connection.platform}`}
                    onClick={() => handleDisconnect(connection.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Desconectar
                  </Button>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Available connections */}
      <Card>
        <CardHeader>
          <CardTitle>Conectar nueva plataforma</CardTitle>
          <CardDescription>Vincula cuentas publicitarias y fuentes de datos.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {availableAccounts.map((account) => {
            const Icon = account.icon;
            const isConnected = connectedAccounts.some(c => c.platform === account.id);
            
            return (
              <div 
                key={account.id} 
                className="flex items-center justify-between p-4 border rounded-lg"
                data-testid={`available-connection-${account.id}`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">{account.name}</p>
                    <p className="text-sm text-muted-foreground">{account.description}</p>
                  </div>
                </div>
                <Button 
                  variant={isConnected ? "outline" : "default"}
                  size="sm"
                  disabled={isConnected}
                  data-testid={`button-connect-${account.id}`}
                  onClick={() => handleConnect(account.id)}
                >
                  {isConnected ? "Conectado" : "Conectar"}
                </Button>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

// Workspace General section
function WorkspaceSection({ workspace }: { workspace?: Workspace }) {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Workspace actualizado",
      description: "Los cambios han sido guardados exitosamente.",
    });
  };

  const handleDelete = () => {
    toast({
      title: "¿Eliminar workspace?",
      description: "Esta acción no se puede deshacer. Todos los datos serán eliminados permanentemente.",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-2">{workspace?.name || "Workspace"}</h1>
        <p className="text-sm text-muted-foreground">
          Configura los ajustes generales de tu workspace.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del workspace</CardTitle>
          <CardDescription>Actualiza el nombre y descripción de tu workspace.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="workspace-name">Nombre del workspace</Label>
            <Input 
              id="workspace-name" 
              data-testid="input-workspace-name"
              defaultValue={workspace?.name} 
              placeholder="Nombre de tu workspace" 
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="workspace-description">Descripción (opcional)</Label>
            <Input 
              id="workspace-description" 
              data-testid="input-workspace-description"
              defaultValue={workspace?.description || ""} 
              placeholder="Describe tu workspace" 
            />
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave} data-testid="button-save-workspace">
              Guardar cambios
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Zona de peligro</CardTitle>
          <CardDescription>
            Acciones irreversibles que afectan permanentemente este workspace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Eliminar workspace</p>
              <p className="text-sm text-muted-foreground">
                Elimina permanentemente este workspace y todos sus datos.
              </p>
            </div>
            <Button 
              variant="destructive" 
              data-testid="button-delete-workspace"
              onClick={handleDelete}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Eliminar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Data sources section
function DataSourcesSection({ connections }: { connections: Connection[] }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Data sources</h1>
        <p className="text-sm text-muted-foreground">
          Visualiza y gestiona las fuentes de datos activas para este workspace.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fuentes activas</CardTitle>
          <CardDescription>Plataformas desde las cuales se están importando datos.</CardDescription>
        </CardHeader>
        <CardContent>
          {connections.filter(c => c.status === "connected").length > 0 ? (
            <div className="space-y-4">
              {connections.filter(c => c.status === "connected").map((connection) => (
                <div 
                  key={connection.id} 
                  className="flex items-center justify-between p-4 border rounded-lg"
                  data-testid={`data-source-${connection.platform}`}
                >
                  <div>
                    <p className="font-medium capitalize">{connection.platform}</p>
                    <p className="text-sm text-muted-foreground">
                      Última sincronización: {connection.lastSyncAt 
                        ? new Date(connection.lastSyncAt).toLocaleDateString('es-ES')
                        : "Nunca"}
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {connection.status === "connected" ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Database className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground">
                No hay fuentes de datos conectadas. Ve a "Mis conexiones" para agregar plataformas.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Miembros section
function MembersSection({ members, workspaceId }: { members: WorkspaceMember[], workspaceId?: string }) {
  const { toast } = useToast();

  const handleInvite = () => {
    toast({
      title: "Invitación enviada",
      description: "Se ha enviado un correo de invitación al nuevo miembro.",
    });
  };

  const handleRemoveMember = (memberId: string) => {
    toast({
      title: "Miembro eliminado",
      description: "El usuario ha sido removido del workspace.",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Miembros</h1>
          <p className="text-sm text-muted-foreground">
            Gestiona los usuarios que tienen acceso a este workspace.
          </p>
        </div>
        <Button data-testid="button-invite-member" onClick={handleInvite}>
          <Plus className="w-4 h-4 mr-2" />
          Invitar miembro
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Equipo actual</CardTitle>
          <CardDescription>
            {members.length} {members.length === 1 ? "miembro" : "miembros"} en este workspace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {members.map((member, index) => (
              <div 
                key={member.id} 
                className="flex items-center justify-between p-4 border rounded-lg"
                data-testid={`member-${index}`}
              >
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback>
                      {member.userId.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Usuario {member.userId.substring(0, 8)}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs capitalize">
                        {member.role}
                      </Badge>
                    </div>
                  </div>
                </div>
                {member.role !== "owner" && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    data-testid={`button-remove-member-${index}`}
                    onClick={() => handleRemoveMember(member.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Nomenclatura section
function NomenclatureSection({ properties, workspaceId }: { properties: NomenclatureProperty[], workspaceId?: string }) {
  const { toast } = useToast();
  const [newProperty, setNewProperty] = useState({ propertyName: "", values: "" });

  const handleAddProperty = () => {
    if (!newProperty.propertyName || !newProperty.values) {
      toast({
        title: "Campos incompletos",
        description: "Por favor completa todos los campos.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Propiedad agregada",
      description: "La nueva propiedad de nomenclatura ha sido creada.",
    });
    setNewProperty({ propertyName: "", values: "" });
  };

  const handleDeleteProperty = (propertyId: string) => {
    toast({
      title: "Propiedad eliminada",
      description: "La propiedad ha sido removida de la nomenclatura.",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Nomenclatura</h1>
        <p className="text-sm text-muted-foreground">
          Define las propiedades y valores permitidos para la nomenclatura de tus reportes.
        </p>
      </div>

      {/* Add new property */}
      <Card>
        <CardHeader>
          <CardTitle>Agregar nueva propiedad</CardTitle>
          <CardDescription>
            Define un nuevo campo de nomenclatura con sus valores permitidos.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="property-name">Nombre de la propiedad</Label>
            <Input 
              id="property-name" 
              data-testid="input-property-name"
              value={newProperty.propertyName}
              onChange={(e) => setNewProperty({ ...newProperty, propertyName: e.target.value })}
              placeholder="ej: formato, plataforma, objetivo" 
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="property-values">Valores permitidos (separados por coma)</Label>
            <Input 
              id="property-values" 
              data-testid="input-property-values"
              value={newProperty.values}
              onChange={(e) => setNewProperty({ ...newProperty, values: e.target.value })}
              placeholder="ej: video, imagen, carrusel" 
            />
          </div>

          <Button onClick={handleAddProperty} data-testid="button-add-property">
            <Plus className="w-4 h-4 mr-2" />
            Agregar propiedad
          </Button>
        </CardContent>
      </Card>

      {/* Existing properties */}
      <Card>
        <CardHeader>
          <CardTitle>Propiedades configuradas</CardTitle>
          <CardDescription>
            {properties.length} {properties.length === 1 ? "propiedad definida" : "propiedades definidas"}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {properties.length > 0 ? (
            <div className="space-y-4">
              {properties.map((property, index) => (
                <div 
                  key={property.id} 
                  className="p-4 border rounded-lg"
                  data-testid={`property-${index}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-medium capitalize">{property.propertyName}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Valores permitidos:
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      data-testid={`button-delete-property-${index}`}
                      onClick={() => handleDeleteProperty(property.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {property.allowedValues?.map((value: string, valueIndex: number) => (
                      <Badge 
                        key={valueIndex} 
                        variant="secondary"
                        data-testid={`property-value-${index}-${valueIndex}`}
                      >
                        {value}
                      </Badge>
                    )) || (
                      <p className="text-sm text-muted-foreground">Sin valores definidos</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Tag className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground">
                No hay propiedades de nomenclatura configuradas. Agrega una arriba para comenzar.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
