import AddEmployeeModal from "@/components/admin-view/AddEmployeeModal";
import EmployeeList from "@/components/admin-view/EmployeeList";
import MemberList from "@/components/admin-view/MemberList";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchEmployeeList, fetchMembers } from "@/store/member/member-slice";
import { Plus, Users } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddMemberModal from "./AddMemberModal";

const Employee = () => {
  const dispatch = useDispatch();
  const { members, employees } = useSelector((state) => state.members);

  useEffect(() => {
    dispatch(fetchMembers());
    dispatch(fetchEmployeeList());
  }, []);

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

          <AddMemberModal onSuccess={() => dispatch(fetchMembers())}>
            <Button size="sm" variant="outline">
              <Users />
              Add Member
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
          <EmployeeList employees={employees} members={members} />
        </TabsContent>

        {/* Members Tab */}
        <TabsContent value="members" className="mt-4">
          <MemberList members={members} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Employee;
