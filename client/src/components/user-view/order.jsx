import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
import { Eye, Pencil, Save, Trash2, Truck } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../../hooks/use-toast";

const initialFormData = {
  date: "",
  meal: {},
};

const EployeeOrder = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const dispatch = useDispatch();
  //   const { orderList } = useSelector((state) => state.adminOrders);
  const { toast } = useToast();

  const onSubmit = (e) => {
    e.preventDefault();

    // const token = JSON.parse(sessionStorage.getItem("token"));
    // currentEditedId !== null
    //   ? dispatch(updateOrder({ id: currentEditedId, formData })).then(
    //       (data) => {
    //         if (data?.payload?.success) {
    //           dispatch(fetchAllOrders(token));
    //           setFormData(initialFormData);
    //           setCurrentEditedId(null);
    //           toast({
    //             title: "Order Updated Successfully",
    //           });
    //         }
    //       }
    //     )
    //   : dispatch(addOrder(formData)).then((data) => {
    //       if (data?.payload?.success) {
    //         dispatch(fetchAllOrders(token));
    //         setFormData(initialFormData);
    //         toast({
    //           title: "Order Added Successfully",
    //         });
    //       } else {
    //         toast({
    //           title: data?.payload?.message,
    //         });
    //       }
    //     });
  };

  const handleDelete = (id) => {
    // dispatch(deleteOrder(id)).then((data) => {
    //   if (data?.payload?.success) {
    //     setIsModalOpen(false);
    //     dispatch(fetchAllOrders());
    //     toast({
    //       title: "Order Deleted Successfully",
    //     });
    //   }
    // });
  };

  useEffect(() => {
    const token = JSON.parse(sessionStorage.getItem("token"));
    // dispatch(fetchAllOrders(token));
  }, [dispatch]);

  return (
    <div className="flex-1">
      <div className="space-y-4">
        <h1>Default Order</h1>
        <Table className="bg-background rounded">
          <TableHeader>
            <TableRow className="p-0 text-nowrap">
              <TableHead>Ruti</TableHead>
              <TableHead>Parota</TableHead>
              <TableHead>Dal</TableHead>
              <TableHead>Vegeable</TableHead>
              <TableHead>Egg</TableHead>
              <TableHead className="w-20 text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>2</TableCell>
              <TableCell>2</TableCell>
              <TableCell>1</TableCell>
              <TableCell>1</TableCell>
              <TableCell>1</TableCell>
              <TableCell className="text-center min-w-28">
                <Button
                  onClick={() => {
                    setFormData(order);
                    // setIsDialogOpen(true);
                  }}
                  variant="white"
                //   className="p-1"
                >
                  <Pencil size={16} className="text-green-500" />
                </Button>
                <Button
                    variant="white"
                >
                  <Save size={20} className="text-blue-500" />
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default EployeeOrder;
