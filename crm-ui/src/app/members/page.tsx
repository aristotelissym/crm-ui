'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { AlignJustify, Pencil, Trash2, Plus, Filter, SortAsc, SortDesc, Search } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import axios from 'axios'
import { DB_Members } from '@/types'

// Constants
const PAGE_SIZE = 10
const API_URL = 'http://localhost:4000/members'
const INITIAL_FORM_STATE: Partial<DB_Members> = {
  last_name: '',
  first_name: '',
  expertise: '',
  sector: '',
  health_unit: '',
  work_place: '',
  home_place: '',
  email: '',
  phone: '',
  consent: '1',
}

export default function MembersPage() {
  // State management
  const [members, setMembers] = useState<DB_Members[]>([])
  const [filtered, setFiltered] = useState<DB_Members[]>([])
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({
    sector: '',
    expertise: '',
    workPlace: '',
  })
  const [sorting, setSorting] = useState({
    field: 'last_name' as keyof DB_Members,
    ascending: true,
  })
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  })
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [formData, setFormData] = useState<Partial<DB_Members>>(INITIAL_FORM_STATE)
  const [dialogState, setDialogState] = useState<null | 'create' | 'edit'>(null)
  const [editMemberId, setEditMemberId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Get unique filter options from data
  const filterOptions = {
    sectors: [...new Set(members.map(m => m.sector))].filter(Boolean),
    expertise: [...new Set(members.map(m => m.expertise))].filter(Boolean),
    workPlaces: [...new Set(members.map(m => m.work_place))].filter(Boolean),
  }

  // Fetch members data
  const fetchMembers = async () => {
    setIsLoading(true)
    try {
      const res = await axios.get(API_URL)
      setMembers(res.data)
    } catch (error) {
      toast.error('Αποτυχία φόρτωσης δεδομένων')
    } finally {
      setIsLoading(false)
    }
  }

  // Initial data fetch
  useEffect(() => {
    fetchMembers()
  }, [])

  // Apply filters, search, and sorting
  useEffect(() => {
    let data = [...members]

    // Apply search
    if (search) {
      data = data.filter((m) =>
        `${m.first_name} ${m.last_name} ${m.email}`.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Apply filters
    if (filters.sector) {
      data = data.filter((m) => m.sector === filters.sector)
    }
    if (filters.expertise) {
      data = data.filter((m) => m.expertise === filters.expertise)
    }
    if (filters.workPlace) {
      data = data.filter((m) => m.work_place === filters.workPlace)
    }

    // Apply sorting
    data.sort((a, b) => {
      const valA = a[sorting.field]?.toString().toLowerCase() || ''
      const valB = b[sorting.field]?.toString().toLowerCase() || ''
      return sorting.ascending ? valA.localeCompare(valB) : valB.localeCompare(valA)
    })

    // Update filtered data and pagination
    setFiltered(data)
    setPagination({
      ...pagination,
      totalPages: Math.ceil(data.length / PAGE_SIZE),
      currentPage: Math.min(pagination.currentPage, Math.ceil(data.length / PAGE_SIZE) || 1)
    })
  }, [search, filters, sorting, members])

  // Calculate current page items
  const paginatedData = filtered.slice(
    (pagination.currentPage - 1) * PAGE_SIZE,
    pagination.currentPage * PAGE_SIZE
  )

  // Form handlers
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Reset form and close dialog
  const resetForm = () => {
    setFormData(INITIAL_FORM_STATE)
    setDialogState(null)
    setEditMemberId(null)
  }

  // Create new member
  const handleCreate = async () => {
    try {
      await axios.post(API_URL, formData)
      toast.success('Ο χρήστης δημιουργήθηκε με επιτυχία!')
      resetForm()
      fetchMembers()
    } catch (error) {
      toast.error('Κάτι δεν πήγε καλά')
    }
  }

  // Edit existing member
  const handleEdit = async () => {
    if (editMemberId) {
      try {
        await axios.patch(`${API_URL}/${editMemberId}`, formData)
        toast.success('Το μέλος ενημερώθηκε!')
        resetForm()
        fetchMembers()
      } catch (error) {
        toast.error('Αποτυχία ενημέρωσης')
      }
    }
  }

  // Open edit dialog
  const openEditDialog = (member: DB_Members) => {
    setFormData({ ...member })
    setEditMemberId(member.id)
    setDialogState('edit')
  }

  // Delete member
  const handleDelete = async (id: string) => {
    if (window.confirm('Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το μέλος;')) {
      try {
        await axios.delete(`${API_URL}/${id}`)
        toast.success('Ο χρήστης διαγράφηκε!')
        fetchMembers()
      } catch (error) {
        toast.error('Σφάλμα διαγραφής')
      }
    }
  }

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) return

    if (window.confirm(`Είστε σίγουροι ότι θέλετε να διαγράψετε ${selectedRows.length} μέλη;`)) {
      try {
        // We could implement a bulk delete endpoint or do it sequentially
        await Promise.all(selectedRows.map(id => axios.delete(`${API_URL}/${id}`)))
        toast.success(`${selectedRows.length} μέλη διαγράφηκαν με επιτυχία!`)
        setSelectedRows([])
        fetchMembers()
      } catch (error) {
        toast.error('Σφάλμα κατά τη διαγραφή')
      }
    }
  }

  // Toggle row selection
  const toggleRowSelection = (id: string) => {
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    )
  }

  // Toggle all rows selection
  const toggleAllSelection = () => {
    if (selectedRows.length === paginatedData.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(paginatedData.map(m => m.id))
    }
  }

  // Handle sort change
  const handleSortChange = (field: keyof DB_Members) => {
    setSorting(prev => ({
      field,
      ascending: prev.field === field ? !prev.ascending : true
    }))
  }

  // Handle filter change
  const handleFilterChange = (filterType: keyof typeof filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  // Handle pagination
  const goToPage = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }))
  }

  const exportCSV = () => {
    const csv = [
      Object.keys(members[0]).join(','),
      ...filtered.map((m) => Object.values(m).join(',')),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = `hippo_members.csv`
    link.click()
  }

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto">
      <Toaster />

      {/* Header */}
      <div>
        
      </div>
      <h1 className="text-2xl font-bold justify-start mr-6">Διαχείριση Μελών</h1>

      <div className="flex justify-end items-center mb-6">
        <button
          onClick={() => {
            setFormData(INITIAL_FORM_STATE)
            setDialogState('create')
          }}
          className="flex items-center px-4 py-2 mr-4 bg-olivegreen text-white rounded hover:bg-success"
        >
          <Plus size={18} className="mr-1" />
          Νέο Μέλος
        </button>
        <button
          onClick={() => {
            if (selectedRows.length < filtered.length) {
              setSelectedRows(filtered.map((m) => m.id))
            } else {
              setSelectedRows([])
            }
          }}
          className="px-4 py-2 rounded bg-info text-white hover:bg-panellinio mr-4"
        >
          {selectedRows.length < filtered.length ? 'Επιλογή Όλων' : 'Καθαρισμός'}
        </button>
        <button
          onClick={exportCSV}
          className="text-white px-4 py-2 mr-6 rounded bg-info hover:bg-panellinio"
        >
          Εξαγωγή σε CSV
        </button>

        <button
            onClick={() => {
              const selectedEmails = filtered
                .filter((m) => selectedRows.includes(m.id))
                .map((m) => m.email)
              if (selectedEmails.length == 1) {
                toast.success('1 Email Αντιγράφηκε')
                navigator.clipboard.writeText(selectedEmails.join(', '))
              } else if (selectedEmails.length > 0) {
                toast.success(`${selectedEmails.length} Emails Αντιγράφηκαν`)
              } else {
                toast('Δεν έχουν επιλεγεί Email', { icon: "📂", position: "top-center" })
              }
            }}
            className="px-4 py-2 rounded bg-info text-white hover:bg-panellinio"
          >
            Αντιγραφή Emails
          </button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="relative md:col-span-2">
          <input
            type="text"
            placeholder="Αναζήτηση..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPagination(prev => ({ ...prev, currentPage: 1 }))
            }}
            className="w-full pl-10 pr-4 py-2 border rounded"
          />
          <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
        </div>

        <select
          value={filters.sector}
          onChange={(e) => handleFilterChange('sector', e.target.value)}
          className="border rounded py-2 px-3"
        >
          <option value="">Όλοι οι Τομείς</option>
          {filterOptions.sectors.map(sector => (
            <option key={sector} value={sector}>{sector}</option>
          ))}
        </select>

        <select
          value={filters.expertise}
          onChange={(e) => handleFilterChange('expertise', e.target.value)}
          className="border rounded py-2 px-3"
        >
          <option value="">Όλες οι Ειδικότητες</option>
          {filterOptions.expertise.map(exp => (
            <option key={exp} value={exp}>{exp}</option>
          ))}
        </select>

        <select
          value={filters.workPlace}
          onChange={(e) => handleFilterChange('workPlace', e.target.value)}
          className="border rounded py-2 px-3"
        >
          <option value="">Όλοι οι Χώροι Εργασίας</option>
          {filterOptions.workPlaces.map(place => (
            <option key={place} value={place}>{place}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="">
              <th className="p-2">
                <input
                  type="checkbox"
                  checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                  onChange={toggleAllSelection}
                />
              </th>
              <th
                className="p-2 cursor-pointer"
                onClick={() => handleSortChange('last_name')}
              >
                <div className="flex items-center">
                  Επώνυμο
                  {sorting.field === 'last_name' && (
                    sorting.ascending ? <SortAsc size={14} /> : <SortDesc size={14} />
                  )}
                </div>
              </th>
              <th
                className="p-2 cursor-pointer"
                onClick={() => handleSortChange('first_name')}
              >
                <div className="flex items-center">
                  Όνομα
                  {sorting.field === 'first_name' && (
                    sorting.ascending ? <SortAsc size={14} /> : <SortDesc size={14} />
                  )}
                </div>
              </th>
              <th className="p-2">Τομέας</th>
              <th className="p-2">Ειδικότητα</th>
              <th className="p-2">Χώρος Εργασίας</th>
              <th className="p-2">Email</th>
              <th className="p-2">Ενέργειες</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={8} className="p-4 text-center">Φόρτωση...</td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-4 text-center">Δεν βρέθηκαν αποτελέσματα</td>
              </tr>
            ) : (
              paginatedData.map((member) => (
                <tr key={member.id} className="hover:bg-accent">
                  <td className="p-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(member.id)}
                      onChange={() => toggleRowSelection(member.id)}
                    />
                  </td>
                  <td className="p-2">{member.last_name}</td>
                  <td className="p-2">{member.first_name}</td>
                  <td className="p-2">{member.sector}</td>
                  <td className="p-2">{member.expertise}</td>
                  <td className="p-2">{member.work_place}</td>
                  <td className="p-2">{member.email}</td>
                  <td className="p-2">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditDialog(member)}
                        className="p-1 bg-blue-500 text-primary rounded hover:bg-info hover:text-white"
                        title="Επεξεργασία"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="p-1 bg-red-500 text-primary rounded hover:bg-redfaded hover:text-white"
                        title="Διαγραφή"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination and Actions */}
      <div className="flex flex-wrap justify-between items-center mt-4">
        <div>
          {selectedRows.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Διαγραφή επιλεγμένων ({selectedRows.length})
            </button>
          )}
        </div>

        <div className="flex space-x-2 mt-2 sm:mt-0">
          <button
            disabled={pagination.currentPage === 1}
            onClick={() => goToPage(1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            &laquo;
          </button>
          <button
            disabled={pagination.currentPage === 1}
            onClick={() => goToPage(pagination.currentPage - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            &lsaquo;
          </button>

          <span className="px-3 py-1">
            {pagination.currentPage} / {pagination.totalPages}
          </span>

          <button
            disabled={pagination.currentPage === pagination.totalPages}
            onClick={() => goToPage(pagination.currentPage + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            &rsaquo;
          </button>
          <button
            disabled={pagination.currentPage === pagination.totalPages}
            onClick={() => goToPage(pagination.totalPages)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            &raquo;
          </button>
        </div>
      </div>

      {/* Dialog for Create/Edit */}
      <Dialog open={dialogState !== null} onClose={resetForm}>
        <div className="fixed inset-0 bg-black/30 text-primary shadow-lg" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-2xl rounded bg-white p-6">
            <DialogTitle className="text-lg font-bold text-primary mb-4">
              {dialogState === 'create' ? 'Νέο Μέλος' : 'Επεξεργασία Μέλους'}
            </DialogTitle>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="block text-sm font-medium mb-1">Επώνυμο</label>
                <input
                  name="last_name"
                  value={formData.last_name || ''}
                  onChange={handleFormChange}
                  placeholder="Επώνυμο"
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div className="form-group">
                <label className="block text-sm font-medium mb-1">Όνομα</label>
                <input
                  name="first_name"
                  value={formData.first_name || ''}
                  onChange={handleFormChange}
                  placeholder="Όνομα"
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div className="form-group">
                <label className="block text-sm font-medium mb-1">Τομέας</label>
                <input
                  name="sector"
                  value={formData.sector || ''}
                  onChange={handleFormChange}
                  placeholder="Τομέας"
                  className="w-full border p-2 rounded"
                />
              </div>
              <div className="form-group">
                <label className="block text-sm font-medium mb-1">Ειδικότητα</label>
                <input
                  name="expertise"
                  value={formData.expertise || ''}
                  onChange={handleFormChange}
                  placeholder="Ειδικότητα"
                  className="w-full border p-2 rounded"
                />
              </div>
              <div className="form-group">
                <label className="block text-sm font-medium mb-1">Μονάδα Υγείας</label>
                <input
                  name="health_unit"
                  value={formData.health_unit || ''}
                  onChange={handleFormChange}
                  placeholder="Μονάδα Υγείας"
                  className="w-full border p-2 rounded"
                />
              </div>
              <div className="form-group">
                <label className="block text-sm font-medium mb-1">Χώρος Εργασίας</label>
                <input
                  name="work_place"
                  value={formData.work_place || ''}
                  onChange={handleFormChange}
                  placeholder="Χώρος Εργασίας"
                  className="w-full border p-2 rounded"
                />
              </div>
              <div className="form-group">
                <label className="block text-sm font-medium mb-1">Τόπος Κατοικίας</label>
                <input
                  name="home_place"
                  value={formData.home_place || ''}
                  onChange={handleFormChange}
                  placeholder="Τόπος Κατοικίας"
                  className="w-full border p-2 rounded"
                />
              </div>
              <div className="form-group">
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={handleFormChange}
                  placeholder="Email"
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div className="form-group">
                <label className="block text-sm font-medium mb-1">Τηλέφωνο</label>
                <input
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleFormChange}
                  placeholder="Τηλέφωνο"
                  className="w-full border p-2 rounded"
                />
              </div>
              <div className="form-group">
                <label className="block text-sm font-medium mb-1">Συγκατάθεση</label>
                <input
                  name="consent"
                  value={formData.consent || '1'}
                  onChange={handleFormChange}
                  placeholder="Συγκατάθεση"
                  className="w-full border p-2 rounded"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={resetForm}
                className="px-4 py-2 bg-gray rounded hover:bg-gray-300"
              >
                Ακύρωση
              </button>
              <button
                onClick={dialogState === 'create' ? handleCreate : handleEdit}
                className="px-4 py-2 bg-success hover:bg-olivegreen text-white rounded"
              >
                {dialogState === 'create' ? 'Δημιουργία' : 'Ενημέρωση'}
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  )
}