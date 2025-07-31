import fb from "@/assets/fb.svg";
import linkedin from "@/assets/in.svg";
import tw from "@/assets/tw.svg";
import { Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import icon from "../../../../public/atpldhaka.png";

const Footer = () => {
  return (
    <div className="bg-slate-800 text-white py-10">
      <div className="grid sm:grid-cols-3 grid-cols-1 gap-6 mx-auto container px-6">
        <div className="flex flex-col">
          <img src={icon} alt="" className="w-20" />
          <p className="mt-5 text-gray-300 text-sm">
            ATPL DHAKA serves as the back office for{" "}
            <Link
              className="text-blue-500"
              to={"https://ampec.com.au"}
              target="_blank"
            >
              Ampec Technologies
            </Link>{" "}
            and{" "}
            <Link
              className="text-blue-500"
              to={"https://totalelectrical.com.au/"}
              target="_blank"
            >
              Total Electrical Connections Pty Ltd
            </Link>
            , located in Uttara, Dhaka-1230, Bangladesh.
          </p>
          <p className="mt-5 text-gray-300 text-sm">
            &copy; Copyright ATPL DHAKA
          </p>
        </div>

        <div className="flex flex-col space-y-4 text-gray-300 text-sm">
          <h1 className="font-bold text-2xl text-amber-400">Get in Touch</h1>
          <div className="flex gap-4">
            <Phone size={20} className="text-amber-400" />
            <p>+880 1714245681</p>
          </div>
          <div className="flex gap-4">
            <Mail size={20} className="text-amber-400" />
            <p>hr@atpldhaka.com</p>
          </div>
          <div className="flex gap-4">
            <MapPin size={20} className="text-amber-400" />
            <p>
              Uttara Tower, level 5 Jashimuddin Avenue,
              <br /> Sector-3 Uttara, Dhaka-1230
            </p>
          </div>
        </div>

        <div className="flex flex-col space-y-4 text-gray-300 text-sm">
          <h1 className="font-bold text-2xl text-amber-400">Social Media</h1>
          <p>
            Follow us on social media to find outthe latest updates on our
            progress.
          </p>
          <div className="flex items-center gap-6">
            <img src={fb} alt="" />
            <img src={tw} alt="" />
            <img src={linkedin} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
