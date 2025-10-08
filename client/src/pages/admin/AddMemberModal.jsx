import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

const initialState = {
  name: "",
  email: "",
  position: "",
};

const AddMemberModal = ({ children }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(initialState);

  const onSubmit = (event) => {
    event.preventDefault();

    // //all fields are required
    if (Object.values(formData).some((value) => !value)) {
      toast.success("All fields are required");
      return;
    }

    // dispatch(registerUser(formData)).then((data) => {
    //   if (data?.payload && data?.payload?.status) {
    //     toast.success(data.payload.message || "Member added successfully");
    //     setFormData(initialState);
    //     setOpen(false);
    //   } else {
    //     toast.error("Member addition failed", {
    //       description: data?.payload?.message || data?.error?.message || "",
    //     });
    //   }
    // });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md w-5/6 max-h-[calc(100vh-4rem)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center mb-4">
            Add New Member
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 pt-2">
          <div className="flex items-center gap-2">
            <Label className="w-24">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <Label className="w-24">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <Label className="w-24">
              Position <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              id="position"
              name="position"
              value={formData.position}
              onChange={(e) =>
                setFormData({ ...formData, position: e.target.value })
              }
              required
            />
          </div>
          <Button type="submit" className="btn btn-primary w-full">
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberModal;
