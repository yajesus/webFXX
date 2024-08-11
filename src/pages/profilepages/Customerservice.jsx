import React from "react";

const Customerservice = () => {
  return (
    <main>
      <div className="w-full">
        <div className="w-full flex flex-col items-center justify-center mt-32 gap-5">
          <div className="w-full flex items-center justify-center gap-5">
            <div className="flex flex-col items-center">
              <a
                href="https://t.me/Webfxservices" // Updated to a direct link to the Telegram profile
                className="flex flex-col items-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={`${process.env.PUBLIC_URL}/telegram.png`}
                  alt="Telegram"
                  className="w-[100px] h-[100px]"
                />
                <p className="font-bold">Telegram</p>
              </a>
            </div>
            <div className="flex flex-col items-center">
              <a
                href="https://wa.me/+14059784550"
                className="flex flex-col items-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={`${process.env.PUBLIC_URL}/whatsapp.png`}
                  alt="WhatsApp"
                  className="w-[100px] h-[100px]"
                />
                <p className="font-bold">WhatsApp</p>
              </a>
            </div>
          </div>
          <p className="font-semibold">Click to Contact Customer Service</p>
          <p className="text-3xl font-bold text-red-600">Notice</p>
          <p className="font-bold">Working Time: 11:00 AM to 23:00 PM</p>
          <p className="font-bold">
            For Advances and Withdrawals, please contact our Customer Service
          </p>
        </div>
      </div>
    </main>
  );
};

export default Customerservice;
