// resources/js/pages/Produksi.jsx
import { Head, useForm } from '@inertiajs/react';
import UserLayout from '@/layouts/User/Layout';
import { useMemo, useState } from 'react';
import DashboardView from './Produksi/DashboardView';
import CreateOrderView from './Produksi/CreateOrderView';
import OrderFormView from './Produksi/OrderFormView';
import ConfirmationView from './Produksi/ConfirmationView';

export default function Produksi({
  auth,
  productions,
  totalSpent,
  completedOrders,
  designs,
  konveksis,
  products
}) {
  const [currentStep, setCurrentStep] = useState('dashboard');
  const [selectedMotif, setSelectedMotif] = useState(null);

  const { data, setData, post, processing, errors } = useForm({
    design_id: '',
    product_id: products?.[0]?.id || '',
    convection_id: konveksis?.[0]?.id || '',
    quantity: 1,
    customer_name: auth.user.name,
    customer_email: auth.user.email,
    customer_phone: '',
    customer_company: '',
    customer_address: '',
    batik_type: 'Batik Printing',
    fabric_size: products?.[0]?.category === 'fabric' ? '5' : 'M',
    special_notes: '',
  });

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    post(route('production.store'), {
      onSuccess: () => setCurrentStep('confirmation'),
    });
  };

  const calculateEstimatedPrice = () => {
    const selectedProduct = products?.find(
      (p) => parseInt(p.id) === parseInt(data.product_id)
    );
    if (!selectedProduct) return 0;

    const batikTypeMultiplier = {
      'Batik Tulis': 3.0,
      'Batik Cap': 2.0,
      'Batik Printing': 1.0,
    };

    const sizeMultiplier = {
      S: 1.0,
      M: 1.05,
      L: 1.1,
      XL: 1.15,
      XXL: 1.2,
    };

    const typeMult = batikTypeMultiplier[data.batik_type] || 1.0;
    let pricePerUnit = selectedProduct.base_price;

    if (selectedProduct.category === 'fabric') {
      const meter = parseFloat(data.fabric_size) || 5;
      pricePerUnit = selectedProduct.base_price * meter * typeMult;
    } else {
      const sizeMult = sizeMultiplier[data.fabric_size] || 1.0;
      pricePerUnit = selectedProduct.base_price * typeMult * sizeMult;
    }

    return pricePerUnit * (data.quantity || 1);
  };

  // --- UI helpers (mobile stepper) ---
  const steps = useMemo(
    () => [
      { key: 'dashboard', label: 'Dashboard' },
      { key: 'create', label: 'Pilih Desain' },
      { key: 'form', label: 'Form Pesanan' },
      { key: 'confirmation', label: 'Selesai' },
    ],
    []
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'create':
        return (
          <CreateOrderView
            designs={designs || []}
            setCurrentStep={setCurrentStep}
            setData={setData}
            setSelectedMotif={setSelectedMotif}
          />
        );
      case 'form':
        return (
          <OrderFormView
            data={data}
            setData={setData}
            errors={errors}
            processing={processing}
            handleSubmitOrder={handleSubmitOrder}
            setCurrentStep={setCurrentStep}
            selectedMotif={selectedMotif}
            konveksis={konveksis || []}
            products={products || []}
            calculateEstimatedPrice={calculateEstimatedPrice}
          />
        );
      case 'confirmation':
        return <ConfirmationView onFinish={() => setCurrentStep('dashboard')} />;
      default:
        return (
          <DashboardView
            productions={productions}
            totalSpent={totalSpent}
            completedOrders={completedOrders}
            onCreateNew={() => setCurrentStep('create')}
          />
        );
    }
  };

  // Kelas wrapper agar responsif & nyaman dibaca di mobile
  const MobileCardWrapper = ({ children }) => (
    <div className="md:p-0">
      {children}
    </div>
  );

  return (
    <UserLayout title="Produksi Batik">
      <Head title="Produksi Saya" />

      {/* Container responsif: batasi lebar di desktop, beri padding nyaman di mobile */}
      <div className="max-w-7xl mx-auto w-full">

        {/* Stepper chips — tampil hanya di mobile, below the mobile title section */}
        <div className="md:hidden sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-3 py-3 mb-4 -mx-4 md:mx-0">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 scrollbar-hide">
            {steps.map((s, idx) => {
              const active = s.key === currentStep;
              const currentIdx = steps.findIndex(step => step.key === currentStep);
              const isPast = idx < currentIdx;
              
              return (
                <button
                  key={s.key}
                  onClick={() => {
                    // Allow navigation to past steps and current step
                    if (idx <= currentIdx) {
                      setCurrentStep(s.key);
                    }
                  }}
                  disabled={idx > currentIdx}
                  className={`relative whitespace-nowrap px-4 py-2 rounded-full text-xs font-medium border transition-all flex items-center gap-2 ${
                    active
                      ? 'bg-[#BA682A] text-white border-[#BA682A] shadow-md'
                      : isPast
                      ? 'bg-orange-50 text-[#BA682A] border-orange-200'
                      : 'bg-white text-gray-400 border-gray-200'
                  } ${idx > currentIdx ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    active ? 'bg-white/30' : isPast ? 'bg-[#BA682A] text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {isPast ? '✓' : idx + 1}
                  </span>
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Konten: dibungkus card di mobile supaya rapi */}
        <div className="md:mt-0">
          <MobileCardWrapper>{renderCurrentStep()}</MobileCardWrapper>
        </div>

        {/* Ringkasan harga sticky bottom — tampil di mobile pada step form */}
        {currentStep === 'form' && (
          <div className="md:hidden fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-gray-200 shadow-lg">
            <div className="px-4 py-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600">Estimasi Total</span>
                <span className="text-sm text-gray-500">{data.quantity} pcs</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg font-bold text-[#BA682A]">
                    Rp {Math.round(calculateEstimatedPrice()).toLocaleString('id-ID')}
                  </span>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    @ {data.quantity > 0 ? `Rp ${Math.round(calculateEstimatedPrice() / data.quantity).toLocaleString('id-ID')}/pcs` : 'Rp 0/pcs'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
}
