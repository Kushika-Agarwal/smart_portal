import React from "react";

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">

      {/* GLOBAL NAVBAR */}
   <header className="w-full bg-white shadow-md">
  <div className="flex flex-wrap items-center justify-between px-4 md:px-10 py-3 gap-2">
    
    {/* Left Logo */}
    <img
      src="/logo_smart_card.png"
      alt="logo"
      className="h-10 md:h-16 object-contain"
    />

    {/* Right Logo */}
    <img
      src="/mod logo.png"
      alt="logo"
      className="h-10 md:h-16 object-contain"
    />

  </div>
</header>
      {/* PAGE CONTENT */}
      <main className="flex-1">
        {children}
      </main>

      {/* GLOBAL FOOTER */}
   {/* GLOBAL FOOTER */}
<footer className="text-center text-sm md:text-md text-white py-4 px-4 bg-gradient-to-r from-slate-700 to-teal-600">
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