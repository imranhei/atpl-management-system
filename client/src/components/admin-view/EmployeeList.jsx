import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  assignToEmployee,
  fetchEmployeeList,
  unassignMember,
} from "@/store/member/member-slice";
import { Loader2Icon, X } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const EmployeeList = ({ employees, members }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.members);
  const [addValue, setAddValue] = useState(""); // empty -> shows placeholder
  console.log(isLoading);

  const handleAddToTeam = (employeeId, memberId) => {
    if (!employeeId || !memberId) {
      toast.error("Invalid selection");
      return;
    }
    dispatch(assignToEmployee({ employeeId, memberId }))
      .unwrap()
      .then(() => {
        dispatch(fetchEmployeeList());
        toast.success("Member added to employee");
        setAddValue(""); // reset -> placeholder shows again
      })
      .catch(() => {
        toast.error("Failed to add member to employee");
      });
  };

  const handleRemoveFromTeam = (employeeId, memberId) => {
    if (!employeeId || !memberId) {
      toast.error("Invalid selection");
      return;
    }
    dispatch(unassignMember({ employeeId, memberId }))
      .unwrap()
      .then(() => {
        dispatch(fetchEmployeeList());
        toast.success("Member removed from employee");
      })
      .catch(() => {
        toast.error("Failed to remove member from employee");
      });
  };

  return (
    <Card>
      <CardHeader className="border-b p-4">
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
                <TableHead>Add Team Member</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    <div className="py-4 text-center text-sm text-muted-foreground flex items-center justify-center">
                      <Loader2Icon className="mr-2 h-4 w-4 animate-spin" /> Loading...
                    </div>
                  </TableCell>
                </TableRow>
              ) : employees && employees.length > 0 ? (
                employees?.map((employee) => (
                  <TableRow key={employee?.user?.id}>
                    <TableCell className="font-medium">
                      {employee?.user?.username
                        ? employee.user.username.charAt(0).toUpperCase() +
                          employee.user.username.slice(1).toLowerCase()
                        : ""}
                    </TableCell>
                    <TableCell>{employee?.user?.email}</TableCell>
                    <TableCell>{employee?.user?.position}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {employee?.members?.map((member) => (
                          <Badge
                            key={member?.id}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            {member.name}
                            <button
                              onClick={() =>
                                handleRemoveFromTeam(
                                  employee?.user.id,
                                  member.id
                                )
                              }
                              className="ml-1 hover:text-red-500"
                              aria-label={`Remove from ${member.name}`}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={addValue}
                        onValueChange={(memberId) => {
                          handleAddToTeam(employee?.user.id, memberId);
                          setAddValue(""); // reset -> placeholder shows again
                        }}
                      >
                        <SelectTrigger className="w-36 h-8 data-[placeholder]:text-muted-foreground">
                          <SelectValue placeholder="Add member" />
                        </SelectTrigger>

                        <SelectContent>
                          {(members ?? [])
                            // exclude members already assigned to this employee
                            .filter(
                              (m) =>
                                !(employee?.members ?? []).some(
                                  (em) => em.id === m.id
                                )
                            )
                            .map((m) => (
                              <SelectItem
                                key={String(m.id)}
                                value={String(m.id)}
                              >
                                {m.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5}>
                    <div className="py-8 text-center text-sm text-muted-foreground">
                      No employees found.
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeList;
