import { Cake, Camera, Mail, Pencil, Phone, RotateCw } from "lucide-react";
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
import Avatar1 from "/avatar.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import ImageUpload from "@/components/admin-view/ImageUpload";
import { updateProfileData } from "@/store/employee/profile-slice";
import { useToast } from "@/hooks/use-toast";
import { checkAuth } from "@/store/auth-slice";

const initialFormData = {
  phone_number: "",
  birthday: null,
};

const Profile = () => {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const { user, profile } = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.profile);
  const [open, setOpen] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);
  const [profileData, setProfileData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [imageLoadingState, setImageLoadingState] = useState(false);

  const handleImageUpload = async () => {
    if (!imageFile) {
      toast({
        title: "No image selected",
        description: "Please select an image to upload.",
        variant: "warning",
      });
      return;
    }

    const formData = new FormData();
    formData.append("profile_img", imageFile);

    try {
      setImageLoadingState(true);
      const token = localStorage.getItem("access_token");

      const res = await dispatch(
        updateProfileData({ token, formData })
      ).unwrap();

      if (res.status === 200) {
        dispatch(checkAuth(token));
        toast({
          title: "Updated successfully",
          description: "Your profile picture has been updated.",
          variant: "success",
        });

        setImageFile(null);
        setOpenUpload(false);
      } else {
        toast({
          title: "Upload failed",
          description: "Unexpected response received.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log(error.profile_img);
      toast({
        title: "Upload failed",
        description:
          error?.profile_img[0] || "Something went wrong while uploading.",
        variant: "destructive",
      });
    } finally {
      setImageLoadingState(false);
    }
  };

  const handleProfileUpdate = async () => {
    const token = localStorage.getItem("access_token");
    const formData = new FormData();

    // Format birthday to 'yyyy-MM-dd' string before appending
    const formattedBirthday = profileData.birthday
      ? format(profileData.birthday, "yyyy-MM-dd")
      : "";

    formData.append("phone_number", profileData.phone_number);
    formData.append("birthday", formattedBirthday);

    try {
      const res = await dispatch(
        updateProfileData({ token, formData })
      ).unwrap();
      if (res.status === 200) {
        dispatch(checkAuth(token));
      }
      toast({
        title: "Updated successfully",
        description: "Your profile has been updated.",
        variant: "success",
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: "Update failed",
        description:
          error?.birthday ||
          error?.phone_number ||
          "Something went wrong while updating.",
        variant: "destructive",
      });
    } finally {
      // Optionally add any cleanup logic here
    }
  };

  const handleDataEdit = () => {
    setProfileData({
      phone_number: profile?.phone_number || "",
      birthday: profile?.birthday ? new Date(profile.birthday) : null,
    });
    setOpen(true);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-8 h-fit sm:w-fit w-full bg-background sm:p-10 p-4 rounded">
      <div className="w-40 h-40 rounded-full bg-teal-300 relative ">
        <Avatar className="focus:outline-none focus-visible:outline-none focus-visible:ring-0 border-white w-full h-full">
          <AvatarImage
            src={`https://djangoattendance.atpldhaka.com${profile.profile_img}`}
            alt="Profile"
            className="object-cover w-full h-full"
          />
          <AvatarFallback>
            <img src={Avatar1} alt="" />
          </AvatarFallback>
        </Avatar>
        <div
          className="absolute bottom-[8%] right-[8%] h-8 w-8 bg-white cursor-pointer p-2 rounded-full flex items-center justify-center text-white shadow-md"
          onClick={() => setOpenUpload(true)}
        >
          <Camera size={20} color="#000000" strokeWidth={2.25} />
        </div>
      </div>
      <Separator orientation="vertical" className="h-40 sm:block hidden" />
      <div className="flex flex-col gap-2">
        <h1 className="font-medium text-lg">
          {user?.first_name} {user?.last_name}
        </h1>
        <div className="flex flex-col sm:flex-row sm:gap-4 gap-2 text-muted-foreground">
          <div className="flex items-center gap-2">
            <Phone size={16} />
            {profile?.phone_number || "Not provided"}
          </div>
          <div className="flex items-center gap-2">
            <Mail size={16} /> {user?.email}
          </div>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Cake size={16} />
          {profile?.birthday
            ? format(new Date(profile.birthday), "PPP")
            : "Not provided"}
        </div>
        <Button
          className="bg-teal-400 hover:bg-teal-500 dark:bg-violet-600 dark:hover:bg-violet-700 !text-white mt-2"
          onClick={handleDataEdit}
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
          <div className="w-full overflow-hidden">
            <div className="w-40 h-40 rounded-full bg-gray-200 dark:bg-slate-800 mx-auto">
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
            <Button
              onClick={handleImageUpload}
              className="dark:bg-violet-600 dark:hover:bg-violet-700 dark:text-white"
            >
              {isLoading ? (
                <>
                  <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
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
                defaultValue={profileData?.phone_number}
                className="col-span-3"
                placeholder="Phone Number"
                onChange={(e) =>
                  setProfileData((prev) => ({
                    ...prev,
                    phone_number: e.target.value,
                  }))
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="birthday" className="text-right">
                Birthday
              </Label>
              <Input
                className="col-span-3"
                type="date"
                value={
                  profileData?.birthday instanceof Date &&
                  !isNaN(profileData.birthday)
                    ? format(profileData.birthday, "yyyy-MM-dd")
                    : ""
                }
                onChange={(e) => {
                  const val = e.target.value;
                  setProfileData((prev) => ({
                    ...prev,
                    birthday: val ? new Date(val) : null,
                  }));
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={handleProfileUpdate}
              className="dark:bg-violet-600 dark:hover:bg-violet-700 dark:text-white"
            >
              {isLoading ? (
                <>
                  <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                  Saving changes...
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
