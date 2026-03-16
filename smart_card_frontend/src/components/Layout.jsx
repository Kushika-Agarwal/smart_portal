import React from "react";

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">

      {/* GLOBAL NAVBAR */}
      <header className="w-full bg-white shadow-md">

        <div className="flex items-center px-6 py-3">

          {/* Logos */}
          <div className="flex items-center gap-6">

            <img
              src="/logo_smart_card.png"
              alt="logo"
              className="h-25"
            />

           

          </div>

        </div>

      </header>

      {/* PAGE CONTENT */}
      <main className="flex-1">
        {children}
      </main>

      {/* GLOBAL FOOTER */}
      <footer className="text-center text-md text-white py-4">
        For any additional inputs, please quote the above query number and send an email on Helpdesk.CSDte@PSQuickIT.com
      </footer>

    </div>
  );
}

export default Layout;