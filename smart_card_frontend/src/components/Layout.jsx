import React from "react";

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">

      {/* GLOBAL NAVBAR */}
   <header className="w-full bg-white shadow-md">
  <div className="flex items-center justify-between px-10 py-3">
    
    {/* Left Logo */}
    <img
      src="/logo_smart_card.png"
      alt="logo"
      className="h-25"
    />

    {/* Right Logo */}
    <img
      src="/mod logo.png"
      alt="logo"
      className="h-25"
    />

  </div>
</header>

      {/* PAGE CONTENT */}
      <main className="flex-1">
        {children}
      </main>

      {/* GLOBAL FOOTER */}
   {/* GLOBAL FOOTER */}
<footer className="text-center text-md text-white py-4 bg-gradient-to-r from-slate-700 to-teal-600">
  <p className="opacity-90">
    For any additional inputs, please quote the above query number and send an email on{" "}
    <a
      href="mailto:Helpdesk.CSDte@PSQuickIT.com"
      className="font-semibold text-yellow-300 hover:text-yellow-400 underline underline-offset-2"
    >
      Helpdesk.CSDte@PSQuickIT.com
    </a>
  </p>
</footer>

    </div>
  );
}

export default Layout;