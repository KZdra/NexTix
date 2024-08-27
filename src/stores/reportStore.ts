import { defineStore } from 'pinia';
import { ref } from 'vue';
import { apiService } from '@/utils/apiService';
import { errorHandling } from '@/utils/errorHandling';
import ExcelJS from 'exceljs';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

interface Report {
  assign_by:string,
  clientname:string,
  created_at:string,
  id_ticket:number,
  issue:string,
  kategori_id:number,
  kategori_name:string,
  status:string,
  subject:string,
  ticket_number:string,
  updated_at:string,
  user_id:number

}

export const useReportStore = defineStore('report', () => {
  const reports = ref<Report[]>([]);

  const fetchReports = async ( startDate?: string, endDate?: string, categoryId?: number) => {
    try {
      const response = await apiService.apiGet('/api/auth/report', {
        start_date: startDate,
        end_date: endDate,
        category_id: categoryId,
      });
      reports.value = response.data.data;
    } catch (error) {
      errorHandling(error)
    } 
  };

  

  const exportToPDF = (startDate?: string, endDate?: string, selectedCategory?: string) => {
    const doc = new jsPDF();
    let title = 'Laporan Ticket ';

    if (startDate && endDate && selectedCategory) {
      title += `${startDate}_${endDate} Kategori ${selectedCategory}`;
    } else if (startDate && endDate) {
      title += `${startDate}_${endDate}`;
    } else if (selectedCategory) {
      title += `Kategori ${selectedCategory}`;
    } else {
      title = 'Laporan Seluruh Ticket';
    }
    
    // Add title
    doc.setFontSize(18);
    const pageWidth = doc.internal.pageSize.getWidth();
    const textWidth = doc.getTextWidth(title);
    const textX = (pageWidth - textWidth) / 2; // Center the title
    doc.text(title, textX, 20);
  
    // Add some spacing before the table
    doc.autoTable({
      margin: { top: 30 },
      head: [
        ['Ticket Number', 'Date', 'Client Name', 'Kategori', 'Subject', 'Status']
      ],
      body: reports.value.map(report => [
        report.ticket_number,
        new Date(report.created_at).toLocaleDateString(),
        report.clientname,
        report.kategori_name,
        report.subject,
        report.status,
      ]),
    });
  
    // Save the PDF
    let fileName = 'Laporan_Tiket_';
    
    if (!startDate && !endDate && !selectedCategory) {
        fileName += 'Semua_Ticket.pdf';
    } else {
        if (startDate && endDate) {
            fileName += `${startDate}_${endDate}`;
        }
        if (selectedCategory) {
            fileName += (startDate && endDate ? '_' : '') + `Kategori_${selectedCategory}`;
        }
        fileName += '.pdf';
    }
    
  
    doc.save(fileName);
  };

// EXCELLL
  const exportToExcel = async (startDate?: string, endDate?: string, selectedCategory?: string) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reports');

    worksheet.columns = [
      { header: 'Ticket Number', key: 'ticket_number', width: 15 },
      { header: 'Date', key: 'date', width: 12 },
      { header: 'Client Name', key: 'clientname', width: 20 },
      { header: 'Kategori', key: 'kategori_name', width: 15 },
      { header: 'Subject', key: 'subject', width: 30 },
      { header: 'Status', key: 'status', width: 10 }
    ];

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

    reports.value.forEach((report:any, index) => {
      const rowIndex = index + 2;
      worksheet.addRow({
        ticket_number: report.ticket_number,
        date: new Date(report.created_at).toLocaleDateString(),
        clientname: report.clientname,
        kategori_name: report.kategori_name,
        subject: report.subject,
        status: report.status,
      });
    });

    let fileName = 'Laporan_Tiket_';
  
    if (!startDate && !endDate && !selectedCategory) {
      fileName += 'Semua_Ticket.xlsx';
  } else {
      if (startDate && endDate) {
          fileName += `${startDate}_${endDate}`;
      }
      if (selectedCategory) {
          fileName += (startDate && endDate ? '_' : '') + `Kategori_${selectedCategory}`;
      }
      fileName += '.xlsx';
  }

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }; 
  return {
    reports,
    fetchReports,
    exportToPDF,
    exportToExcel,
  };
});
