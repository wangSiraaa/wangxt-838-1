import { useState, useMemo } from 'react';
import { Plus, LayoutGrid, Search, Package } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { SkateTable } from '../components/features/SkateTable';
import { Modal } from '../components/ui/Modal';
import { StatsCard } from '../components/features/StatsCard';
import { StatusLegend } from '../components/features/StatusLegend';
import { useSkateStore } from '../stores/useSkateStore';
import { useUiStore } from '../stores/useUiStore';
import { SIZE_OPTIONS, BRAND_OPTIONS, COLOR_OPTIONS } from '../utils/constants';
import { useValidation } from '../hooks/useValidation';
import { Skate, SkateStatus, UserRole } from '../types';

export function Inventory() {
  const { skates, addSkate, updateSkate, updateSkateStatus, deleteSkate, getStats } = useSkateStore();
  const currentRole = useUiStore(state => state.currentRole);
  const isAdmin = currentRole === UserRole.ADMIN;
  const { errors, validateSize, validateSkateCode, clearAllErrors } = useValidation();

  const stats = getStats();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | SkateStatus>('all');
  const [sizeFilter, setSizeFilter] = useState<'all' | number>('all');

  const [showModal, setShowModal] = useState(false);
  const [editingSkate, setEditingSkate] = useState<Skate | null>(null);
  const [formData, setFormData] = useState({
    skateCode: '',
    size: 40,
    brand: BRAND_OPTIONS[0],
    color: COLOR_OPTIONS[0]
  });
  const [submitting, setSubmitting] = useState(false);

  const filteredSkates = useMemo(() => {
    return skates.filter(skate => {
      const matchesSearch = !searchTerm ||
        skate.skateCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skate.brand.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || skate.status === statusFilter;
      const matchesSize = sizeFilter === 'all' || skate.size === sizeFilter;
      return matchesSearch && matchesStatus && matchesSize;
    });
  }, [skates, searchTerm, statusFilter, sizeFilter]);

  const openAddModal = () => {
    setEditingSkate(null);
    setFormData({
      skateCode: '',
      size: 40,
      brand: BRAND_OPTIONS[0],
      color: COLOR_OPTIONS[0]
    });
    clearAllErrors();
    setShowModal(true);
  };

  const openEditModal = (skate: Skate) => {
    setEditingSkate(skate);
    setFormData({
      skateCode: skate.skateCode,
      size: skate.size,
      brand: skate.brand,
      color: skate.color
    });
    clearAllErrors();
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isCodeValid = validateSkateCode(formData.skateCode);
    const isSizeValid = validateSize(formData.size);

    if (!isCodeValid || !isSizeValid) return;

    setSubmitting(true);
    try {
      if (editingSkate) {
        updateSkate(editingSkate.id, {
          ...formData,
          status: editingSkate.status
        });
        alert('冰鞋信息更新成功！');
      } else {
        addSkate({
          ...formData,
          status: SkateStatus.AVAILABLE
        });
        alert('冰鞋添加成功！');
      }
      setShowModal(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (skate: Skate) => {
    if (skate.status === SkateStatus.RENTED) {
      alert('该冰鞋正在租借中，无法删除！');
      return;
    }
    if (confirm(`确定要删除冰鞋 ${skate.skateCode} 吗？`)) {
      deleteSkate(skate.id);
    }
  };

  const handleMarkAvailable = (skate: Skate) => {
    if (confirm(`冰鞋 ${skate.skateCode} 消毒完成，标记为可租？`)) {
      updateSkateStatus(skate.id, SkateStatus.AVAILABLE);
    }
  };

  const handleMarkDisinfecting = (skate: Skate) => {
    if (confirm(`将冰鞋 ${skate.skateCode} 标记为消毒中？`)) {
      updateSkateStatus(skate.id, SkateStatus.DISINFECTING);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">库存管理</h1>
          <p className="text-slate-500 mt-1">冰场前台 · 维护冰鞋尺码库存</p>
        </div>
        <StatusLegend />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="总冰鞋数"
          value={stats.total}
          icon={<Package className="w-5 h-5" />}
          color="sky"
        />
        <StatsCard
          title="可租"
          value={stats.available}
          icon={<LayoutGrid className="w-5 h-5" />}
          color="emerald"
        />
        <StatsCard
          title="租借中"
          value={stats.rented}
          icon={<Package className="w-5 h-5" />}
          color="violet"
        />
        <StatsCard
          title="消毒中"
          value={stats.disinfecting}
          icon={<Package className="w-5 h-5" />}
          color="orange"
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-64">
            <Input
              placeholder="搜索冰鞋编号、品牌..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-40"
          >
            <option value="all">全部状态</option>
            <option value={SkateStatus.AVAILABLE}>可租</option>
            <option value={SkateStatus.RENTED}>租借中</option>
            <option value={SkateStatus.DISINFECTING}>消毒中</option>
          </Select>
          <Select
            value={sizeFilter.toString()}
            onChange={(e) => setSizeFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="w-32"
          >
            <option value="all">全部尺码</option>
            {SIZE_OPTIONS.map(size => (
              <option key={size} value={size}>{size}码</option>
            ))}
          </Select>
          {isAdmin && (
            <Button onClick={openAddModal} className="gap-2">
              <Plus className="w-4 h-4" />
              添加冰鞋
            </Button>
          )}
        </div>
      </div>

      <div className="text-sm text-slate-500">
        筛选结果：共 {filteredSkates.length} 双冰鞋
      </div>

      <SkateTable
        skates={filteredSkates}
        onEdit={isAdmin ? openEditModal : undefined}
        onDelete={isAdmin ? handleDelete : undefined}
        onMarkAvailable={isAdmin ? handleMarkAvailable : undefined}
        onMarkDisinfecting={isAdmin ? handleMarkDisinfecting : undefined}
      />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingSkate ? '编辑冰鞋信息' : '添加冰鞋'}
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowModal(false)} disabled={submitting}>
              取消
            </Button>
            <Button type="submit" form="skate-form" disabled={submitting}>
              {submitting ? '保存中...' : (editingSkate ? '保存修改' : '添加')}
            </Button>
          </div>
        }
      >
        <form id="skate-form" onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="冰鞋编号"
            name="skateCode"
            value={formData.skateCode}
            onChange={(e) => setFormData(prev => ({ ...prev, skateCode: e.target.value }))}
            placeholder="如：ICE-001"
            error={errors.skateCode}
          />
          <div className="grid grid-cols-3 gap-4">
            <Select
              label="尺码"
              value={formData.size}
              onChange={(e) => setFormData(prev => ({ ...prev, size: Number(e.target.value) }))}
              error={errors.size}
            >
              {SIZE_OPTIONS.map(size => (
                <option key={size} value={size}>{size}码</option>
              ))}
            </Select>
            <Select
              label="品牌"
              value={formData.brand}
              onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
            >
              {BRAND_OPTIONS.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </Select>
            <Select
              label="颜色"
              value={formData.color}
              onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
            >
              {COLOR_OPTIONS.map(color => (
                <option key={color} value={color}>{color}</option>
              ))}
            </Select>
          </div>
        </form>
      </Modal>
    </div>
  );
}
