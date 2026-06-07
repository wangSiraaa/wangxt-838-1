import { useState, useEffect } from 'react';
import { User, Phone, Footprints } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { useUiStore } from '../../stores/useUiStore';
import { useSkateStore } from '../../stores/useSkateStore';
import { useRentalStore } from '../../stores/useRentalStore';
import { useValidation } from '../../hooks/useValidation';
import { STATUS_LABELS } from '../../utils/constants';

export function RentalModal() {
  const { showRentalModal, setShowRentalModal, selectedSkateId, setSelectedSkateId } = useUiStore();
  const getSkateById = useSkateStore(state => state.getSkateById);
  const { rentals, createRental } = useRentalStore();
  const { errors, validatePhone, validateName, validatePhoneRentable, clearAllErrors } = useValidation();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const selectedSkate = selectedSkateId ? getSkateById(selectedSkateId) : undefined;

  useEffect(() => {
    if (!showRentalModal) {
      setCustomerName('');
      setPhone('');
      clearAllErrors();
      setSubmitting(false);
    }
  }, [showRentalModal, clearAllErrors]);

  const handleClose = () => {
    setShowRentalModal(false);
    setSelectedSkateId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSkate) return;

    const isNameValid = validateName(customerName);
    const isPhoneValid = validatePhone(phone);
    const phoneRentable = validatePhoneRentable(phone, rentals);

    if (!isNameValid || !isPhoneValid || !phoneRentable.valid) {
      if (!phoneRentable.valid) {
        alert(phoneRentable.message);
      }
      return;
    }

    setSubmitting(true);
    try {
      const result = createRental({
        skateId: selectedSkate.id,
        phone,
        customerName: customerName.trim()
      });

      if (result.success) {
        alert(`租借成功！\n租借单号：${result.order?.orderNo}`);
        handleClose();
      } else {
        alert(result.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={showRentalModal}
      onClose={handleClose}
      title="冰鞋租借申请"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={handleClose} disabled={submitting}>
            取消
          </Button>
          <Button
            type="submit"
            form="rental-form"
            disabled={submitting}
          >
            {submitting ? '提交中...' : '确认租借'}
          </Button>
        </div>
      }
    >
      {selectedSkate ? (
        <form id="rental-form" onSubmit={handleSubmit} className="space-y-5">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
                <Footprints className="w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">{selectedSkate.skateCode}</p>
                <p className="text-sm text-slate-500">
                  {selectedSkate.size}码 · {selectedSkate.brand} · {selectedSkate.color}
                </p>
              </div>
              <Badge
                variant="skate"
                status={selectedSkate.status}
                className="ml-auto"
              >
                {STATUS_LABELS[selectedSkate.status]}
              </Badge>
            </div>
          </div>

          <div className="space-y-4">
            <Input
              label="姓名"
              name="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="请输入姓名"
              error={errors.name}
              icon={<User className="w-4 h-4" />}
            />

            <Input
              label="手机号"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="请输入11位手机号"
              maxLength={11}
              error={errors.phone}
              icon={<Phone className="w-4 h-4" />}
            />
          </div>

          <div className="text-xs text-slate-500 bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="font-medium text-amber-700 mb-1">租借须知</p>
            <ul className="list-disc list-inside space-y-1 text-amber-600">
              <li>请妥善保管冰鞋，损坏需照价赔偿</li>
              <li>预计归还时间为次日闭店前</li>
              <li>逾期未还将产生滞纳金</li>
            </ul>
          </div>
        </form>
      ) : (
        <div className="text-center py-8 text-slate-500">
          请先选择要租借的冰鞋
        </div>
      )}
    </Modal>
  );
}
