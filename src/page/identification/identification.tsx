import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/LogoV.svg"; 

export default function Identification() {
  const [showPassword, setShowPassword] = useState(false);
  const [nom, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [error, setError] = useState(""); 
  
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (nom === "irisadmin" && password === "iris123") {
      setError("");
      localStorage.setItem("isAdmin", "true"); 
      navigate("/dashboard"); 
    } else {
      setError("Identifiant ou mot de passe incorrect.");
    }
  };

  return (
    <div className="min-h-screen w-screen bg-[#F4F6F9] flex items-center justify-center relative overflow-hidden font-sans">
      
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 opacity-20">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10%" cy="20%" r="60" fill="#CBD5E1" />
            <circle cx="25%" cy="30%" r="40" fill="#CBD5E1" />
            <line x1="10%" y1="20%" x2="25%" y2="30%" stroke="#CBD5E1" strokeWidth="20" />
            <circle cx="80%" cy="60%" r="70" fill="#CBD5E1" />
            <circle cx="95%" cy="40%" r="50" fill="#CBD5E1" />
            <line x1="80%" y1="60%" x2="95%" y2="40%" stroke="#CBD5E1" strokeWidth="20" />
        </svg>
      </div>

      <div className="bg-white p-10 rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full max-w-[450px] z-10 relative">
        
        <div className="flex justify-center mb-8">
          <img src={logo} alt="Iris Logo" className="h-16 w-auto" />
        </div>

        <h2 className="text-[28px] font-bold text-center text-[#2D3142] mb-6">
          Espace Administrateur
        </h2>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-md">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          
          <div>
            <label className="block text-[#4B5563] text-sm font-medium mb-2">
              Identifiant
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                type="text" 
                required
                value={nom}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7165E3] focus:border-transparent transition-all"
                placeholder="Entrer le nom de l'administrateur"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#4B5563] text-sm font-medium mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7165E3] focus:border-transparent transition-all tracking-wider"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                   <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center mt-4 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-[#7165E3] hover:bg-[#5f54cc] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7165E3] transition-colors"
          >
            Se connecter
          </button>

        </form>
      </div>
    </div>
  );
}