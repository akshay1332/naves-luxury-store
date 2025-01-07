import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LuxuryLoader } from "@/components/LuxuryLoader";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { convertToINR } from "@/utils/currency";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Invoice {
  id: string;
  invoice_number: string;
  created_at: string;
  total_amount: number;
  invoice_data: any;
}

export const InvoiceSection = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: invoices, isLoading } = useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('orders')
        .select('id, invoice_number, created_at, total_amount, invoice_data')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch invoices",
        });
        return [];
      }

      return data || [];
    }
  });

  const handleDelete = async (invoiceId: string) => {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', invoiceId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete invoice",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Invoice deleted successfully",
    });
    queryClient.invalidateQueries({ queryKey: ['invoices'] });
  };

  const downloadInvoice = async (invoice: Invoice) => {
    // Here you would typically generate a PDF or fetch it from storage
    // For now, we'll just download the invoice data as JSON
    const blob = new Blob([JSON.stringify(invoice.invoice_data, null, 2)], {
      type: 'application/json'
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${invoice.invoice_number}.json`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <LuxuryLoader />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Invoices</h2>
      {!invoices || invoices.length === 0 ? (
        <p className="text-gray-500">No invoices yet</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice Number</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>{invoice.invoice_number}</TableCell>
                <TableCell>
                  {new Date(invoice.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>{convertToINR(invoice.total_amount)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadInvoice(invoice)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Invoice</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this invoice? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(invoice.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};