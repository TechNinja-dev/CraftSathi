import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import CreatePostPanel from './CreatePostPanel';

export default function FloatingCreateButton() {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            boxShadow: ["0 0 0 rgba(236,72,153,0.4)", "0 0 30px rgba(236,72,153,0.8)", "0 0 0 rgba(236,72,153,0.4)"]
          }}
          transition={{
            opacity: { duration: 0.5 },
            scale: { duration: 0.5, type: "spring", bounce: 0.5 },
            boxShadow: { duration: 2, repeat: Infinity }
          }}
          className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 text-white shadow-2xl border border-white/20"
        >
          <Plus size={28} />
        </motion.button>
      </Dialog.Trigger>
      
      {/* Mobile Creation Modal */}
      <AnimatePresence>
        {open && (
           <Dialog.Portal forceMount>
             <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-md z-50" />
             <Dialog.Content className="fixed inset-x-0 bottom-0 max-h-[90vh] overflow-y-auto z-50 bg-[#080211] rounded-t-3xl border-t border-white/10 shadow-2xl" asChild>
               <motion.div
                 initial={{ y: "100%" }}
                 animate={{ y: 0 }}
                 exit={{ y: "100%" }}
                 transition={{ type: "spring", damping: 25, stiffness: 200 }}
               >
                  <div className="p-4 flex justify-center sticky top-0 bg-[#080211] z-10 w-full mb-[-20px]">
                    <div className="w-12 h-1.5 bg-white/20 rounded-full" />
                  </div>
                  <div className="p-4 relative">
                     <CreatePostPanel />
                     <button onClick={() => setOpen(false)} className="absolute top-8 right-8 text-white">X</button>
                  </div>
               </motion.div>
             </Dialog.Content>
           </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
