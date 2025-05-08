import { Cake, Mail, Pencil, Phone } from "lucide-react";
import React, { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Avatar from "/avatar.png";
import { useDispatch, useSelector } from "react-redux";
import ImageUpload from "@/components/admin-view/ImageUpload";
import {
  getProfile,
  updateProfileImage,
  updateProfileData,
} from "@/store/employee/profile-slice";

const initialFormData = {
  profile_img: null,
  phone_number: "",
  birthday: null,
};

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [imageLoadingState, setImageLoadingState] = useState(false);

  const handleImageUpload = async () => {
    if (imageFile) {
      // const formData = new FormData();
      // formData.append("profile_img", imageFile);
      // setImageLoadingState(true);
      // await dispatch(updateProfileImage({ token, formData }));
      // setImageLoadingState(false);
      setOpenUpload(false);
    }
  };

  const handleProfileUpdate = async () => {
    // const formData = new FormData();
    // formData.append("phone_number", formData.phone_number);
    // formData.append("birthday", formData.birthday);
    // await dispatch(updateProfileData({ token, formData }));
    setOpen(false);
  };

  return (
    <div className="flex items-center gap-8 h-fit w-fit bg-background sm:p-10 p-4 rounded">
      <div className="w-40 h-40 rounded-full bg-teal-300 relative ">
        <img src={Avatar} alt="" className="h-full w-full object-cover" />
        <div
          className="absolute bottom-[8%] right-[8%] h-8 w-8 bg-white cursor-pointer p-2 rounded-full flex items-center justify-center text-white shadow-md"
          onClick={() => setOpenUpload(true)}
        >
          <Pencil size={20} color="#000000" strokeWidth={2.25} />
        </div>
      </div>
      <Separator orientation="vertical" className="h-40" />
      <div className="flex flex-col gap-2">
        <h1 className="font-medium text-lg">
          {user?.first_name} {user?.last_name}
        </h1>
        <div className="flex gap-4 text-muted-foreground">
          <div className="flex items-center gap-2">
            <Phone size={16} />
            01500000000
          </div>
          <div className="flex items-center gap-2">
            <Mail size={16} /> {user?.email}
          </div>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Cake size={16} />
          Birthday: 20-01-1998
        </div>
        <Button
          className="bg-teal-400 hover:bg-teal-500 text-white mt-2"
          onClick={() => setOpen(true)}
        >
          Edit
        </Button>
      </div>
      <Dialog open={openUpload} onOpenChange={setOpenUpload}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profile Picture</DialogTitle>
            <DialogDescription>
              Upload a new profile picture here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="">
            <div className="w-40 h-40 rounded-full bg-gray-200 mx-auto">
              {imageFile ? (
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <p className="text-center text-muted-foreground pt-16">
                  No image selected
                </p>
              )}
            </div>
            <ImageUpload
              imageFile={imageFile}
              setImageFile={setImageFile}
              imageLoadingState={imageLoadingState}
            />
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleImageUpload}>
              Upload Picture
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contact" className="text-right">
                Contact
              </Label>
              <Input
                id="contact"
                defaultValue="01*********"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="birthday" className="text-right">
                Birthday
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "col-span-3 justify-start text-left font-normal",
                      !formData?.birthday && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon />
                    {formData?.birthday ? (
                      format(formData.birthday, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData?.birthday}
                    onSelect={() =>
                      setFormData((prev) => ({
                        ...prev,
                        birthday: date,
                      }))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleProfileUpdate}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
