import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogTrigger
} from '@/components/ui/dialog'
import React, { useState } from 'react'
import { Label } from '@radix-ui/react-label'

export default function PurchaseOrderReport() {
  const [inputValue, setInputValue] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [changeDateOpen, setChangeDateOpen] = useState(false)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      setDialogOpen(true)
      e.preventDefault()
    }
  }

  return (
    <>
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>Purchase Order Report</CardTitle>
            <div className="w-full md:w-1/3">
              <div className="d-flex justify-content-end mb-2">
                {/* Change Date Link with Dialog Trigger */}
                <Dialog open={changeDateOpen} onOpenChange={setChangeDateOpen}>
                  <DialogTrigger asChild>
                    <div className="text-xs my-auto mx-3 cursor-pointer text-blue-600">
                      Change Date
                    </div>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Change Date</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 mt-4">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="from" className="text-sm w-24">
                          From Date
                        </Label>
                        <Input id="from" type="date" className="h-8 text-sm flex-1" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Label htmlFor="to" className="text-sm w-24">
                          To Date
                        </Label>
                        <Input id="to" type="date" className="h-8 text-sm flex-1" />
                      </div>
                    </div>
                    <DialogFooter className="flex justify-end gap-2 mt-4">
                      <Button variant="outline" onClick={() => setChangeDateOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setChangeDateOpen(false)}>Apply</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Static Date Display */}
                <div>29-08-2025</div>
                <div className="mx-3 text-xs my-auto">To</div>
                <div>29-08-2025</div>
              </div>
              <Input type="text" placeholder="Search..." />
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col gap-4">
          <div className="rounded-md border overflow-hidden flex-1">
            <div className="h-[380px] overflow-auto">
              <Table className="min-w-full">
                <TableHeader className="bg-gray-50 sticky top-0">
                  <TableRow style={{ textWrap: 'nowrap' }}>
                    <TableHead>Date</TableHead>
                    <TableHead>Particular</TableHead>
                    <TableHead>Vch Type</TableHead>
                    <TableHead>Vch No</TableHead>
                    <TableHead>Debit Amount</TableHead>
                    <TableHead>Credit Amount</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  <TableRow>
                    <TableCell>Lorem Ipsum</TableCell>
                    <TableCell>Lorem Ipsum</TableCell>
                    <TableCell>Lorem Ipsum</TableCell>
                    <TableCell>Lorem Ipsum</TableCell>
                    <TableCell>Lorem Ipsum</TableCell>
                    <TableCell>Lorem Ipsum</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
