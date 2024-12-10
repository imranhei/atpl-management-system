import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { getAllOrder } from "@/store/employee/meal-slice";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";

const EmployeeOrderHistory = () => {
  const [allOrder, setAllOrder] = useState([]);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orders } = useSelector((state) => state.meal);
  const { menu } = useSelector((state) => state.menu);

  const headers = Array.from(
    new Set(Object.values(menu).flatMap(item => Object.keys(item)))
  );
  console.log(headers);

  useEffect(() => {
    if (user) {
      // dispatch(getAllOrder(user.emp_code));
    }
  }, [dispatch, user]);

  useEffect(() => {
    const uniqueItems = Array.from(
      new Set(orders.flatMap((order) => Object.keys(order.meal)))
    );
    setAllOrder(uniqueItems);
  }, [orders]);

  return (
    <div className="">
      <h1 className="text-center font-semibold text-lg my-4">Order History</h1>
      <Table className="bg-background rounded">
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            {allOrder.map((item) => (
              <React.Fragment key={item}>
                <TableHead>{item} Quantity</TableHead>
                <TableHead>{item} Variant</TableHead>
              </React.Fragment>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order._id}>
              <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
              {allOrder.map((item) => (
                <React.Fragment key={item}>
                  <TableCell>{order.meal[item]?.quantity || "1"}</TableCell>
                  <TableCell>{order.meal[item]?.variant || "-"}</TableCell>
                </React.Fragment>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmployeeOrderHistory;
