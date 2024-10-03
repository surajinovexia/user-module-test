'use client'

// React Imports
import { useEffect, useState, useMemo } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import TablePagination from '@mui/material/TablePagination'

// Third-party Imports
import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'

// Component Imports
import { Box, Tooltip } from '@mui/material'

import TableFilters from './TableFilters'
import AddTestDrawer from './AddTestDrawer'
import CustomAvatar from '@core/components/mui/Avatar'

// Util Imports
// import { getInitials } from '../../../../../../Utils/getInitials'
// import { getLocalizedUrl } from '../../../../../../Utils/i18n'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import AlertDialogBox from '@/Components/Common/AlertDialogBox'
import DialogBoxComponent from '@/Components/Common/DialogBoxComponent'
import FilterHeader from '@/Components/globals/FilterHeader'
import { getInitials } from '@/Utils/getInitials'
import useDraggableList from '@/Components/globals/useDraggableList'

// import DialogBoxComponent from '@/Components/Common/DialogBoxComponent'

// Styled Components
const Icon = styled('i')({})

const fuzzyFilter = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
  // States
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])
  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <TextField {...props} value={value} onChange={e => setValue(e.target.value)} size='small' />
}

// Vars
const userRoleObj = {
  admin: { icon: 'ri-vip-crown-line', color: 'error' },
  author: { icon: 'ri-computer-line', color: 'warning' },
  editor: { icon: 'ri-edit-box-line', color: 'info' },
  maintainer: { icon: 'ri-pie-chart-2-line', color: 'success' },
  subscriber: { icon: 'ri-user-3-line', color: 'primary' }
}

const userStatusObj = {
  Published: 'success',
  Unpublished: 'warning'

  // Unpublished: 'secondary'
}

// Column Definitions
const columnHelper = createColumnHelper()

const TestListTable = ({ tableData, addUserData, deleteUserData }) => {
  // States
  const [addUserOpen, setAddUserOpen] = useState(false)

  const [editUserOpen, setEditUserOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState(...[tableData])
  const [editData, setEditData] = useState()
  const [filteredData, setFilteredData] = useState(data)
  const [globalFilter, setGlobalFilter] = useState('')
  const [type, setType] = useState('')

  //Dialog states
  const [openStatusDialog, setOpenStatusDialog] = useState(false)
  const statusOptions = ['Unpublished', 'Published']
  const [selectedStatus, setSelectedStatus] = useState('')
  const [open, setOpen] = useState(false)

  const initialColumns = [
    'select',
    'title',
    'created_by',
    'questions',
    'enrolment',
    'submission',
    'type',
    'status',
    'action'
  ]

  const [visibleColumns, setVisibleColumns] = useState({
    select: true,
    title: true,
    created_by: true,
    questions: true,
    enrolment: true,
    submission: true,
    type: true,
    status: true,
    action: false
  })

  const { items: columnOrder, handleDragOver, handleDrop, handleDragStart } = useDraggableList(initialColumns)

  const handleCancelDelete = () => {
    setOpen(false)
  }

  const handleConfirmDelete = () => {
    setOpen(false)
  }

  const handleChangeStatus = event => setSelectedStatus(event.target.value)

  // Function to open dialog and initialize the selected user's status
  const handleOpenStatusDialog = user => {
    setSelectedStatus('Published') // Initialize the status with the user's current status
    setOpenStatusDialog(true)
  }

  // Function to close the dialog
  const handleCloseStatusDialog = () => {
    setOpenStatusDialog(false)
  }

  const handleSaveStatus = () => {
    // Save status logic here
    handleCloseStatusDialog()
  }

  useEffect(() => {
    setData(tableData)
  }, [tableData])

  // Hooks
  const { lang: locale } = useParams()

  // const columns = useMemo(
  //   () => [
  //     {
  //       id: 'select',
  //       header: ({ table }) => (
  //         <Checkbox
  //           {...{
  //             checked: table.getIsAllRowsSelected(),
  //             indeterminate: table.getIsSomeRowsSelected(),
  //             onChange: table.getToggleAllRowsSelectedHandler()
  //           }}
  //         />
  //       ),
  //       cell: ({ row }) => (
  //         <Checkbox
  //           {...{
  //             checked: row.getIsSelected(),
  //             disabled: !row.getCanSelect(),
  //             indeterminate: row.getIsSomeSelected(),
  //             onChange: row.getToggleSelectedHandler()
  //           }}
  //         />
  //       )
  //     },
  //     columnHelper.accessor('title', {
  //       header: 'Test Name',
  //       cell: ({ row }) => (
  //         <div className='flex items-center gap-3'>
  //           <div className='flex flex-col'>
  //             <Typography color='text.primary' className='font-medium'>
  //               {row.original.title}
  //             </Typography>
  //             {/* <Typography variant='body2'>{row.original.username}</Typography> */}
  //           </div>
  //         </div>
  //       )
  //     }),
  //     columnHelper.accessor('created_by', {
  //       header: 'Creator',
  //       cell: ({ row }) => <Typography>{row.original.created_by}</Typography>
  //     }),
  //     columnHelper.accessor('questions', {
  //       header: 'Questions',
  //       cell: ({ row }) => <Typography>10</Typography>
  //     }),
  //     columnHelper.accessor('enrolment', {
  //       header: 'Enrolment',
  //       cell: ({ row }) => <Typography>10</Typography>
  //     }),
  //     columnHelper.accessor('submission', {
  //       header: 'Submission',
  //       cell: ({ row }) => <Typography>10</Typography>
  //     }),

  //     // columnHelper.accessor('created_on', {
  //     //   header: 'Date of Creation',
  //     //   cell: ({ row }) => (
  //     //     <div className='flex items-center gap-2'>
  //     //       <Typography className='capitalize' color='text.primary'>
  //     //         {row.original.created_on}
  //     //       </Typography>
  //     //     </div>
  //     //   )
  //     // }),
  //     columnHelper.accessor('type', {
  //       header: 'Type',
  //       cell: ({ row }) => (
  //         <Typography className='capitalize' color='text.primary'>
  //           {row.original.type}
  //         </Typography>
  //       )
  //     }),
  //     columnHelper.accessor('status', {
  //       header: 'Status',
  //       cell: ({ row }) => (
  //         <div className='flex items-center gap-3'>
  //           <Chip
  //             variant='tonal'
  //             label={row?.original?.status === '1' ? 'Published' : 'Unpublished'}
  //             size='small'
  //             color={userStatusObj[row?.original?.status === '1' ? 'Published' : 'Unpublished']}
  //             className='capitalize'
  //           />
  //         </div>
  //       )
  //     }),
  //     columnHelper.accessor('action', {
  //       header: 'Action',
  //       cell: ({ row }) => (
  //         <div className='flex items-center gap-0.5'>
  //           <IconButton
  //             size='small'
  //             onClick={() => {
  //               deleteUserData(row?.original?.guid)
  //             }}
  //           >
  //             <i className='ri-delete-bin-7-line text-textSecondary' />
  //           </IconButton>
  //           <IconButton size='small'>
  //             <Link
  //               href={getLocalizedUrl(`/apps/test/questions/?guid=${row?.original?.guid}`, locale)}
  //               className='flex'
  //             >
  //               <i className='ri-eye-line text-textSecondary' />
  //             </Link>
  //           </IconButton>
  //           <IconButton size='small'>
  //             <Link href={getLocalizedUrl(`/apps/test/edit?guid=${row?.original?.guid}`, locale)} className='flex'>
  //               <i className='ri-edit-box-line text-textSecondary' />
  //             </Link>
  //           </IconButton>
  //           {/* <OptionMenu
  //             iconClassName='text-textSecondary'
  //             data={row}
  //             options={[
  //               {
  //                 text: 'Download',
  //                 icon: 'ri-download-line'
  //               },
  //               {
  //                 text: 'Edit',
  //                 icon: 'ri-edit-box-line'
  //               }
  //             ]}
  //           /> */}
  //         </div>
  //       ),
  //       enableSorting: false
  //     })
  //   ],
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   [data, filteredData]
  // )

  const columns = useMemo(
    () =>
      columnOrder
        .map(columnId => {
          switch (columnId) {
            case 'select':
              return visibleColumns.select
                ? {
                    id: 'select',
                    header: ({ table }) => (
                      <Checkbox
                        {...{
                          checked: table.getIsAllRowsSelected(),
                          indeterminate: table.getIsSomeRowsSelected(),
                          onChange: table.getToggleAllRowsSelectedHandler()
                        }}
                      />
                    ),
                    cell: ({ row }) => (
                      <Checkbox
                        {...{
                          checked: row.getIsSelected(),
                          disabled: !row.getCanSelect(),
                          indeterminate: row.getIsSomeSelected(),
                          onChange: row.getToggleSelectedHandler()
                        }}
                        onClick={e => e.stopPropagation()}
                      />
                    )
                  }
                : null
            case 'title':
              return visibleColumns.title
                ? columnHelper.accessor('title', {
                    header: 'Test Name',
                    cell: ({ row }) => (
                      <div className='flex items-center gap-3'>
                        <div className='flex flex-col'>
                          <Typography color='text.primary' className='font-medium'>
                            {row.original.title}
                          </Typography>
                          {/* <Typography variant='body2'>{row.original.username}</Typography> */}
                        </div>
                      </div>
                    )
                  })
                : null
            case 'created_by':
              return visibleColumns.created_by
                ? columnHelper.accessor('created_by', {
                    header: 'Creator',
                    cell: ({ row }) => <Typography>{row.original.created_by}</Typography>
                  })
                : null
            case 'questions':
              return visibleColumns.questions
                ? columnHelper.accessor('questions', {
                    header: 'Questions',
                    cell: ({ row }) => <Typography>10</Typography>
                  })
                : null
            case 'enrolment':
              return visibleColumns.enrolment
                ? columnHelper.accessor('enrolment', {
                    header: 'Enrolment',
                    cell: ({ row }) => <Typography>10</Typography>
                  })
                : null
            case 'submission':
              return visibleColumns.submission
                ? columnHelper.accessor('submission', {
                    header: 'Submission',
                    cell: ({ row }) => <Typography>10</Typography>
                  })
                : null
            case 'type':
              return visibleColumns.type
                ? columnHelper.accessor('type', {
                    header: 'Type',
                    cell: ({ row }) => (
                      <Typography className='capitalize' color='text.primary'>
                        {row.original.type}
                      </Typography>
                    )
                  })
                : null
            case 'status':
              return visibleColumns.status
                ? columnHelper.accessor('status', {
                    header: 'Status',
                    cell: ({ row }) => (
                      <div className='flex items-center gap-3'>
                        <Chip
                          variant='tonal'
                          label={row?.original?.status === '1' ? 'Published' : 'Unpublished'}
                          size='small'
                          color={userStatusObj[row?.original?.status === '1' ? 'Published' : 'Unpublished']}
                          className='capitalize'
                        />
                      </div>
                    )
                  })
                : null
            case 'action':
              return columnHelper.accessor('action', {
                header: 'Action',
                cell: ({ row }) => (
                  <div className='flex items-center gap-0.5'>
                    <IconButton
                      size='small'
                      onClick={() => {
                        deleteUserData(row?.original?.guid)
                      }}
                    >
                      <i className='ri-delete-bin-7-line text-textSecondary' />
                    </IconButton>
                    <IconButton size='small'>
                      <Link href={`/test/questions/?guid=${row?.original?.guid}`} className='flex'>
                        <i className='ri-eye-line text-textSecondary' />
                      </Link>
                    </IconButton>
                    <IconButton size='small'>
                      <Link href={`/test/edit?guid=${row?.original?.guid}`} className='flex'>
                        <i className='ri-edit-box-line text-textSecondary' />
                      </Link>
                    </IconButton>
                    {/* <IconButton size='small'>
                      <Link href={`/test/manage?guid=${row?.original?.guid}`} className='flex'>
                        <i class='ri-tools-line'></i>
                      </Link>
                    </IconButton> */}
                    {/* <OptionMenu
                      iconClassName='text-textSecondary'
                      data={row}
                      options={[
                        {
                          text: 'Download',
                          icon: 'ri-download-line'
                        },
                        {
                          text: 'Edit',
                          icon: 'ri-edit-box-line'
                        }
                      ]}
                    /> */}
                  </div>
                ),
                enableSorting: false
              })
            default:
              return null
          }
        })
        .filter(Boolean),
    [columnOrder, visibleColumns, data]
  )

  const table = useReactTable({
    data: filteredData,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      rowSelection,
      globalFilter
    },
    initialState: {
      pagination: {
        pageSize: 10
      }
    },
    enableRowSelection: true, //enable row selection for all rows
    // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  console.info(Object.keys(rowSelection)?.length)

  const getAvatar = params => {
    const { avatar, fullName } = params

    if (avatar) {
      return <CustomAvatar src={avatar} skin='light' size={34} />
    } else {
      return (
        <CustomAvatar skin='light' size={34}>
          {getInitials(fullName)}
        </CustomAvatar>
      )
    }
  }

  const CustomTooltip = styled(Tooltip)`
    background-color: #1976d2; /* Change background color */
    color: #ffffff; /* Change text color */
  `

  return (
    <>
      <FilterHeader title='All Tests' subtitle='Orders placed across your store' link='/test/list'>
        <Grid item xs={6} md={2} display='flex' alignItems='center' pb={3}>
          <Button
            fullWidth
            variant='contained'
            onClick={() => setAddUserOpen(!addUserOpen)}
            className='max-sm:is-full'
            startIcon={
              <i
                class='ri-add-fill'
                style={{
                  width: 21.6,
                  height: 21.6
                }}
              />
            }
          >
            Add New Test
          </Button>
        </Grid>
      </FilterHeader>
      <Card>
        <Grid container item xs={12} display='flex' alignItems='center'>
          {/* <Grid container item xs={12} display='flex' justifyContent='space-between' alignItems='center' pt={4} px={3}> */}
          {/* <Grid item xs={4} display='flex' alignItems='center'> */}

          {/* <IconButton onClick={() => router.push('/en/test/list')}>
                <i class='ri-arrow-left-line'></i>
              </IconButton>
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: 24
                }}
                pl={1}
              >
                All Tests
              </Typography> */}
          {/* </Grid> */}
          {/* <Grid item xs={2}>
              <Button
                fullWidth
                variant='contained'
                onClick={() => setAddUserOpen(!addUserOpen)}
                className='max-sm:is-full'
                startIcon={
                  <i
                    class='ri-add-fill'
                    style={{
                      width: 21.6,
                      height: 21.6
                    }}
                  />
                }
              >
                Add New Test
              </Button>
            </Grid> */}
          {/* </Grid> */}
          {/* <Grid item xs={12}>
            <CardHeader title='Filters' className='pbe-4' />
          </Grid> */}
          <Grid item xs={12}>
            <TableFilters
              setData={setFilteredData}
              tableData={data}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
              type={type}
              setType={setType}
            />
          </Grid>
        </Grid>
        <Grid container item xs={12} pl={5}>
          <Grid item xs={0.9}>
            <Box display='flex' justifyContent='space-between' alignItems='center'>
              <IconButton
                disableRipple
                disabled={!Object.keys(rowSelection)?.length}
                sx={{
                  border: `1px solid ${Object.keys(rowSelection)?.length ? '#808080' : '#E7E7E7'}`,
                  borderRadius: 0
                }}
                onClick={() => setOpen(true)}
              >
                {/* <CustomTooltip title='Add' arrow> */}
                <i
                  class='ri-delete-bin-6-fill'
                  color={Object.keys(rowSelection)?.length ? '#B5B8FA' : '#808080'}
                  style={{
                    width: 20,
                    height: 20,
                    ...(Object.keys(rowSelection)?.length
                      ? {
                          color: '#B5B8FA'
                        }
                      : { color: '#808080' })
                  }}
                ></i>
                {/* </CustomTooltip> */}
              </IconButton>
              <IconButton
                disableRipple
                disabled={!Object.keys(rowSelection)?.length}
                sx={{
                  border: `1px solid ${Object.keys(rowSelection)?.length ? '#808080' : '#E7E7E7'}`,
                  borderRadius: 0
                }}
                onClick={() => handleOpenStatusDialog('Published')}
              >
                <i
                  class='ri-checkbox-circle-line'
                  color={Object.keys(rowSelection)?.length ? '#B5B8FA' : '#808080'}
                  style={{
                    width: 20,
                    height: 20,
                    ...(Object.keys(rowSelection)?.length
                      ? {
                          color: '#B5B8FA'
                        }
                      : { color: '#808080' })
                  }}
                ></i>
              </IconButton>
              {/* <TestOptionMenu
                iconClassName='text-textSecondary'
                // setEditFilterOpen={setEditFilterOpen}
                // data={row}
                // setEditData={setEditData}
                rowSelection={rowSelection}
                options={[
                  {
                    text: 'Test Name'
                  },
                  {
                    text: 'Start Date'
                  },
                  {
                    text: 'End Date'
                  },
                  {
                    text: 'Type'
                  },
                  {
                    text: 'Status'
                  }
                ]}
              /> */}
            </Box>
          </Grid>
          <Grid container pr={8} item xs={11} spacing={3} display='flex' alignItems='center' justifyContent='flex-end'>
            {/* <Grid item xs={2}>
              <Button
                size='large'
                color='secondary'
                fullWidth
                variant='outlined'
                startIcon={<i className='ri-upload-2-line' />}
                className='max-sm:is-full'
              >
                Export
              </Button>
            </Grid>
            <Grid item xs={2}>
              <Button
                size='large'
                fullWidth
                color='secondary'
                variant='outlined'
                startIcon={<i className='ri-upload-2-line' />}
                className='max-sm:is-full'
              >
                Export
              </Button>
            </Grid> */}
            <Grid item xs={3.5}>
              {/* <Button
                // size='large'
                color='secondary'
                fullWidth
                variant='outlined'
                onClick={() => {}}
                startIcon={
                  <i
                    class='ri-settings-2-line'
                    style={{
                      width: 21.8,
                      height: 21.8
                    }}
                  />
                }

                // className='max-sm:is-full'
              >
                Manage Question Templates
              </Button> */}
            </Grid>
            {/* <Grid item xs={2.5}>
              <Button
                // size='large'
                fullWidth
                variant='contained'
                onClick={() => setAddUserOpen(!addUserOpen)}
                className='max-sm:is-full'
                startIcon={
                  <i
                    class='ri-add-fill'
                    style={{
                      width: 21.6,
                      height: 21.6
                    }}
                  />
                }
              >
                Add New Test
              </Button>
            </Grid> */}
          </Grid>
        </Grid>

        {/* <div className='flex justify-between gap-4 p-5 flex-col items-start sm:flex-row sm:items-center'>
          <div className='flex items-center gap-x-4 max-sm:gap-y-4 flex-col max-sm:is-full sm:flex-row'>
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={value => setGlobalFilter(String(value))}
              placeholder='Search User'
              className='max-sm:is-full'
            />
            <Button variant='contained' onClick={() => setAddUserOpen(!addUserOpen)} className='max-sm:is-full'>
              Add New User
            </Button>
          </div>
        </div> */}
        <div className='overflow-x-auto pt-5'>
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header, index) => (
                    <th
                      key={header.id}
                      draggable // Makes the column header draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(index)}
                      style={{ cursor: 'grab' }}
                    >
                      {header.isPlaceholder ? null : (
                        <>
                          <div
                            className={classnames({
                              'flex items-center': header.column.getIsSorted(),
                              'cursor-pointer select-none': header.column.getCanSort()
                            })}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                              asc: <i className='ri-arrow-up-s-line text-xl' />,
                              desc: <i className='ri-arrow-down-s-line text-xl' />
                            }[header.column.getIsSorted()] ?? null}
                          </div>
                        </>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            {table.getFilteredRowModel().rows.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                    No data available
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {table
                  .getRowModel()
                  .rows.slice(0, table.getState().pagination.pageSize)
                  .map(row => {
                    return (
                      <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                        {row.getVisibleCells().map(cell => (
                          <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                        ))}
                      </tr>
                    )
                  })}
              </tbody>
            )}
          </table>
        </div>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component='div'
          className='border-bs'
          count={table.getFilteredRowModel().rows.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          SelectProps={{
            inputProps: { 'aria-label': 'rows per page' }
          }}
          onPageChange={(_, page) => {
            table.setPageIndex(page)
          }}
          onRowsPerPageChange={e => table.setPageSize(Number(e.target.value))}
        />
      </Card>
      <AddTestDrawer
        open={addUserOpen}
        handleClose={() => setAddUserOpen(!addUserOpen)}
        userData={data}
        setData={setData}
        addUserData={addUserData}
      />
      {open && (
        <AlertDialogBox
          open={open}
          handleCancel={handleCancelDelete}
          handleConfirm={handleConfirmDelete}
          title='Delete Users'
          textContent='Are you sure you want to delete this user?'
          acceptedButton='Delete'
          rejectedButton='Cancel'
        />
      )}
      {/* status Dialog */}
      <DialogBoxComponent
        open={openStatusDialog}
        onClose={handleCloseStatusDialog}
        title='Change Status'
        description='Are you sure you want to change status?'
        confirmText='Save'
        onConfirm={handleSaveStatus}
        statusOptions={statusOptions}
        selectedStatus={selectedStatus}
        onChangeStatus={handleChangeStatus}
        isStatusDialog={true}
      />
    </>
  )
}

export default TestListTable
