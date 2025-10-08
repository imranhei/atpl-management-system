import AddEmployeeModal from "@/components/admin-view/AddEmployeeModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Users } from "lucide-react";
import { useEffect, useState } from "react";
import AddMemberModal from "./AddMemberModal";

const Employee = () => {
  const [employees, setEmployees] = useState([{
    id: 1,
    name: "John Doe",
    email: "Vt6fH@example.com",
  }]);
  const [teams, setTeams] = useState([]);
  const [members, setMembers] = useState([{
    id: 1, name: "Jane Smith", email: "F7i0Y@example.com", position: "Designer",
  }]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // fetchData();
  }, []);

  const handleDeleteEmployee = (id) => {};
  const handleAddToTeam = (employeeId, teamId) => {};
  const handleRemoveFromTeam = (employeeId, teamId) => {};

  // minimal member actions
  const handleEditMember = (id) => {};
  const handleRemoveMember = (id) => {};

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight">
          Employee Management
        </h1>

        <div className="flex w-full sm:w-auto flex-col sm:flex-row gap-2 sm:gap-3">
          <AddEmployeeModal>
            <Button size="sm" className="w-full sm:w-auto justify-center">
              <Plus className="h-4 w-4" />
              <span className="whitespace-nowrap">Register Employee</span>
            </Button>
          </AddEmployeeModal>

          <AddMemberModal>
            <Button
              size="sm"
              variant="outline"
              className="w-full sm:w-auto justify-center"
            >
              <Users className="h-4 w-4" />
              <span className="whitespace-nowrap">Add Member</span>
            </Button>
          </AddMemberModal>
        </div>
      </div>

      <Tabs defaultValue="employees" className="w-full">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="employees" className="flex-1 sm:flex-none">
            Employees
          </TabsTrigger>
          <TabsTrigger value="members" className="flex-1 sm:flex-none">
            Members
          </TabsTrigger>
        </TabsList>

        {/* Employees Tab */}
        <TabsContent value="employees" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Employees</CardTitle>
              <CardDescription>
                A list of all employees in your organization with their team
                assignments.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Teams</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell className="font-medium">
                          {employee.name}
                        </TableCell>
                        <TableCell>{employee.email}</TableCell>
                        <TableCell>{employee.position}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {employee.teamMembers?.map((member) => (
                              <Badge
                                key={member.team.id}
                                variant="secondary"
                                className="flex items-center gap-1"
                              >
                                {member.team.name}
                                <button
                                  onClick={() =>
                                    handleRemoveFromTeam(
                                      employee.id,
                                      member.team.id
                                    )
                                  }
                                  className="ml-1 hover:text-red-500"
                                  aria-label={`Remove from ${member.team.name}`}
                                >
                                  ×
                                </button>
                              </Badge>
                            ))}
                            <Select
                              onValueChange={(teamId) =>
                                handleAddToTeam(employee.id, teamId)
                              }
                            >
                              <SelectTrigger className="w-36 h-8">
                                <SelectValue placeholder="Add to team" />
                              </SelectTrigger>
                              <SelectContent>
                                {teams
                                  .filter(
                                    (team) =>
                                      !employee.teamMembers?.some(
                                        (m) => m.team.id === team.id
                                      )
                                  )
                                  .map((team) => (
                                    <SelectItem key={team.id} value={team.id}>
                                      {team.name}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteEmployee(employee.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {employees.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5}>
                          <div className="py-8 text-center text-sm text-muted-foreground">
                            {loading ? "Loading..." : "No employees found."}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Members Tab */}
        <TabsContent value="members" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Members</CardTitle>
              <CardDescription>
                Manage your member pool outside the company roster.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {members.map((m) => (
                      <TableRow key={m.id}>
                        <TableCell className="font-medium">{m.name}</TableCell>
                        <TableCell>{m.email}</TableCell>
                        <TableCell>{m.position}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditMember(m.id)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleRemoveMember(m.id)}
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {members.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4}>
                          <div className="py-8 text-center text-sm text-muted-foreground">
                            {loading ? "Loading..." : "No members found."}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Employee;
