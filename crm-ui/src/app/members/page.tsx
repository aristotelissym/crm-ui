'use client'

import { useEffect, useState } from 'react'
import { DB_Members } from '@/types'
import { Menu } from '@headlessui/react'
import { AlignJustify } from 'lucide-react'


const pageSize = 10

export default function MembersPage() {
  const [members, setMembers] = useState<DB_Members[]>([])
  const [filtered, setFiltered] = useState<DB_Members[]>([])
  const [search, setSearch] = useState('')
  const [filterSector, setFilterSector] = useState('')
  const [filterExpertise, setFilterExpertise] = useState('')
  const [filterWorkPlace, setFilterWorkPlace] = useState('')
  const [sortBy, setSortBy] = useState<keyof DB_Members>('last_name')
  const [sortAsc, setSortAsc] = useState(true)
  const [page, setPage] = useState(1)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [showToast, setShowToast] = useState(false)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [selectedMember, setSelectedMember] = useState<DB_Members | null>(null)




  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`http://localhost:4000/members`)
      const data: DB_Members[] = await res.json()
      setMembers(data)
    }
    fetchData()
  }, [])

  useEffect(() => {
    let data = [...members]

    // Filter
    if (search)
      data = data.filter((m) =>
        `${m.first_name} ${m.last_name} ${m.email}`.toLowerCase().includes(search.toLowerCase())
      )
    if (filterSector) data = data.filter((m) => m.sector === filterSector)
    if (filterExpertise) data = data.filter((m) => m.expertise === filterExpertise)
    if (filterWorkPlace) data = data.filter((m) => m.work_place === filterWorkPlace)

    // Sort
    data.sort((a, b) => {
      const valA = a[sortBy]?.toString().toLowerCase()
      const valB = b[sortBy]?.toString().toLowerCase()
      return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA)
    })

    setFiltered(data)
  }, [search, filterSector, filterExpertise, filterWorkPlace, sortBy, sortAsc, members])

  const totalPages = Math.ceil(filtered.length / pageSize)
  const paginatedData = filtered.slice((page - 1) * pageSize, page * pageSize)

  const handleSort = (key: keyof DB_Members) => {
    if (sortBy === key) setSortAsc(!sortAsc)
    else {
      setSortBy(key)
      setSortAsc(true)
    }
  }

  const copyAllEmails = () => {
    const emails = filtered.map((m) => m.email).join(', ')
    navigator.clipboard.writeText(emails)
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
    <div className="text-white-600 ßcol-black p-4 space-y-6">
      {/* Top Filters */}
      <div className="text-primary flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Αναζήτηση..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-primary p-2 rounded w-60"
          />

          <select
            value={filterSector}
            onChange={(e) => setFilterSector(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Τομέας</option>
            <option value="Δημόσιος">Δημόσιος</option>
            <option value="Ιδιωτικός">Ιδιωτικός</option>
          </select>

          <select
            value={filterExpertise}
            onChange={(e) => setFilterExpertise(e.target.value)}
            className=" border p-2 rounded"
          >
            <option value="">Ειδικότητα</option>
            <option value="Ψυχιατρική">Ψυχιατρική</option>
            <option value="Παθολογία">Παθολογία</option>
            <option value="ΓενικήΟικογενειακή Ιατρική">Γενική/Οικογενειακή Ιατρική</option>
          </select>

          <select
            value={filterWorkPlace}
            onChange={(e) => setFilterWorkPlace(e.target.value)}
            className=" border p-2 rounded"
          >
            <option value="">Τόπος Εργασίας</option>
            <option value="Θεσσαλονίκη">Θεσσαλονίκη</option>
            <option value="Άγνωστο">Άγνωστο</option>
            <option value="Κυκλάδες">Κυκλάδες</option>
            <option value="Αττική">Αττική</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              const selectedEmails = filtered
                .filter((m) => selectedRows.includes(m.id))
                .map((m) => m.email)
              if (selectedEmails.length > 0) {
                navigator.clipboard.writeText(selectedEmails.join(', '))
                setShowToast(true)
                setTimeout(() => setShowToast(false), 3000)
              }
            }}
            className="px-4 py-2 rounded bg-primary dark:bg-primary text-white hover:bg-headerBorder"
          >
            Copy Emails
          </button>

          <button
            onClick={() => {
              if (selectedRows.length < filtered.length) {
                setSelectedRows(filtered.map((m) => m.id))
              } else {
                setSelectedRows([])
              }
            }}
            className="px-4 py-2 rounded bg-primary text-white hover:bg-info"
          >
            {selectedRows.length < filtered.length ? 'Select All' : 'Deselect All'}
          </button>
          <button
            onClick={exportCSV}
            className="bg-green-600 text-white px-4 py-2 rounded bg-primary hover:bg-info"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-primary rounded">
          <thead className="bg-primary text-left">
            <tr>
              <th className="p-3">
                {/* <input
                  type="checkbox"
                  checked={selectedRows.length === filtered.length && filtered.length > 0}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedRows(filtered.map((m) => m.id))
                    } else {
                      setSelectedRows([])
                    }
                  }}
                /> */}
              </th>
              {[
                ['Όνομα', 'first_name'],
                ['Επίθετο', 'last_name'],
                ['Email', 'email'],
                ['Ειδικότητα', 'expertise'],
                ['Τομέας', 'sector'],
                ['Μονάδα Υγείας', 'health_unit'],
              ].map(([label, key]) => (
                <th
                  key={key}
                  className="p-3 cursor-pointer"
                  onClick={() => handleSort(key as keyof DB_Members)}
                >
                  {label} {sortBy === key && (sortAsc ? '↑' : '↓')}
                </th>
              ))}
              <th className="p-3">Περισσότερα</th>
            </tr>
          </thead>
          <tbody className='bg-white text-primary'>
            {paginatedData.map((m) => (
              <tr
                key={m.id}
                className={`cursor-pointer hover:bg-accent ${selectedRows.includes(m.id) ? 'bg-accent' : ''}`}
              >
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(m.id)}
                    onChange={() => {
                      setSelectedRows((prev) =>
                        prev.includes(m.id)
                          ? prev.filter((id) => id !== m.id)
                          : [...prev, m.id]
                      )
                    }}
                  />
                </td>
                <td className="p-3">{m.first_name}</td>
                <td className="p-3">{m.last_name}</td>
                <td className="p-3">{m.email}</td>
                <td className="p-3">{m.expertise}</td>
                <td className="p-3">{m.sector}</td>
                <td className="p-3">{m.health_unit}</td>
                <td className="p-3">
                  <Menu as="div" className="relative inline-block text-left">
                    <Menu.Button className="flex items-center justify-end w-8 h-8 rounded hover:bg-gray-200">
                      <AlignJustify className="h-5 w-5 text-gray-600" />
                    </Menu.Button>

                    <Menu.Items className="absolute right-0 z-20 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        <Menu.Item>
                          <button
                            onClick={() => {
                              setSelectedMember(m)
                              setShowDetailDialog(true)
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-accent"
                          >
                            More
                          </button>
                        </Menu.Item>
                        <Menu.Item>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(m.email)
                              setShowToast(true)
                              setTimeout(() => setShowToast(false), 2000)
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-accent"
                          >
                            Copy Email
                          </button>
                        </Menu.Item>
                        <Menu.Item as="div">
                          <button
                            onClick={() => {
                              if (confirm(`Delete ${m.first_name}?`)) {
                                // TODO: call delete API
                                alert(`${m.first_name} deleted.`)
                              }
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-accent"
                          >
                            Delete
                          </button>
                        </Menu.Item>
                      </div>
                    </Menu.Items>

                  </Menu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 text-primary">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
      {showToast && (
        <div className="fixed top-6 right-6 bg-success text-white px-4 py-2 rounded shadow-lg animate-fade-in-up z-50">
          {selectedRows.length} Emails copied to clipboard! 📋
        </div>
      )}
      // More details for each user
      {showDetailDialog && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg relative">
            <h2 className="text-lg text-primary font-bold mb-4">Λεπτομέρειες</h2>
            <ul className="text-sm space-y-1 text-primary">
              <li><strong>ID:</strong> {selectedMember.id}</li>
              <li><strong>Επίθετο:</strong> {selectedMember.last_name}</li>
              <li><strong>Όνομα:</strong> {selectedMember.first_name}</li>
              <li><strong>Ειδικότητα:</strong> {selectedMember.expertise}</li>
              <li><strong>Τομέας:</strong> {selectedMember.sector}</li>
              <li><strong>Μονάδα Υγείας:</strong> {selectedMember.health_unit}</li>
              <li><strong>Τόπος Εργασίας:</strong> {selectedMember.work_place}</li>
              <li><strong>Τόπος Διαμονής:</strong> {selectedMember.home_place}</li>
              <li><strong>Email:</strong> {selectedMember.email}</li>
              <li><strong>Τηλέφωνο:</strong> {selectedMember.phone}</li>
            </ul>
            <button
              className="absolute top-2 right-2 text-gray-500 text-primary hover:text-panellinio"
              onClick={() => setShowDetailDialog(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}

    </div>
  )
}