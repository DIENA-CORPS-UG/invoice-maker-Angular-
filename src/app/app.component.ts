import { Component, resolveForwardRef } from '@angular/core';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { ReplaySubject } from 'rxjs';
pdfMake.vfs = pdfFonts.pdfMake.vfs;



class Product {
  name : string ;
  boxes : number;
  price : number;
  quantity : number;
}



class Invoice {
  clientName : string;
  address : string;
  contactNo : number;
  email : string;

  products : Product[] = [];
  additionalDetails : string;

  constructor(){
    this.products.push(new Product());
  }
}






@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  invoice = new Invoice();

  generatePDF(action = 'open') {
    let docDefinition = {
      content: [
        {

          text: 'JACOB FOODS UGANDA LIMITED.',
          fontSize: 16,
          alignment: 'center',
          color: '#047886'
        },
        {
          text: 'INVOICE',
          fontSize: 20,
          bold: true,
          alignment: 'center',
          decoration: 'underline',
          color: 'skyblue'
        },
        {
          text: 'Customer Details',
          style: 'sectionHeader'
        },
        {
          columns: [
            [
              {
                text: this.invoice.clientName,
                bold:true
              },
              { text: this.invoice.address },
              { text: this.invoice.email },
              { text: this.invoice.contactNo }
            ],
            [
              {
                text:`EXPORTER`,
                style: 'sectionHeader',
                alignment: 'right'
              },
              {
                text: `JACOB FOODS UGANDA LIMITED `,
                alignment: 'right'
              },
              {
                text: `LOCATION: KAMPALA UGANDA `,
                alignment :'right'
              },
              {
                text: `Date: ${new Date().toLocaleString()}`,
                alignment: 'right'
              },
              {
                text: `Bill No : ${((Math.random() *1000).toFixed(0))}`,
                alignment: 'right'
              }
            ]
          ]
        },
        {
          text: 'Order Details',
          style: 'sectionHeader'
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto','auto'],
            body: [
              ['Product', 'Price', 'Quantity','Boxes', 'Amount'],
              ...this.invoice.products.map(p => ([p.name,p.price, p.quantity,p.boxes , (p.price*p.quantity).toFixed(2)])),
              [{text: 'Total Amount', colSpan: 3}, {}, {}, {}, this.invoice.products.reduce((sum, p)=> sum + (p.quantity * p.price), 0).toFixed(2)]
            ]
          }
        },
        {
          text: 'Additional Details',
          style: 'sectionHeader'
        },
        {
            text: this.invoice.additionalDetails,
            margin: [0, 0 ,0, 15]
        },
        {
          columns: [
            [{ qr: `${this.invoice.clientName}`, fit: '50' }],
            [{ text: 'Signature', alignment: 'right', italics: true}],
          ]
        },
        {
          text: 'Terms and Conditions',
          style: 'sectionHeader'
        },
        {
            ul: [
              'Warrenty of the product will be subject to the manufacturer terms and conditions.',
            ],
        }
      ],
      styles: {
        sectionHeader: {
          bold: true,
          decoration: 'underline',
          fontSize: 14,
          margin: [0, 15,0, 15]
        }
      }
    };

    if(action==='download'){
      pdfMake.createPdf(docDefinition).download();
    }else if(action === 'print'){
      pdfMake.createPdf(docDefinition).print();
    }else{
      pdfMake.createPdf(docDefinition).open();
    }

  }

  addProduct(){
    this.invoice.products.push(new Product());
  }
}

/* getImageFromUrl(url){
  return new Promise((resolve, reject) => {
    var img = new Image();
    img.setAttribute("crossOrigin", "anonymous");
    img.onload = () => {
      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      var dataURL = canvas.toDataURL("image/png");
      resolve(dataURL);
    };
    img.onerror = error => {
      reject(error);
    };
    img.src = url;
  });
}
function getImageFromUrl(url: any) {
  throw new Error('Function not implemented.');
} */

