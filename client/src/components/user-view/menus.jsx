import React, { Fragment } from 'react'
import { Separator } from '../ui/separator'
import { menus } from "@/components/config";

const EmployeeMenu = () => {
  return (
    <div className="bg-background rounded-lg shadow-md p-4 space-y-2">
          <h1 className="font-bold text-lg">Menus</h1>
          {/* <Separator /> */}
          {menus.map((menu) => (
            <Fragment key={menu.day}>
              <Separator />
              <div className="flex items-center">
                <div className="w-28 font-semibold">{menu.day} :</div>
                <div>
                  <div>{menu.items.join(", ")}</div>
                  <div>{menu.time}</div>
                </div>
              </div>
            </Fragment>
          ))}
        </div>
  )
}

export default EmployeeMenu
