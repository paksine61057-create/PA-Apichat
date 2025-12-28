
/**
 * GOOGLE APPS SCRIPT BACKEND
 * 1. Create a Google Sheet.
 * 2. Create a sheet named "Works" with headers: id, title, category, description, type, url, createdAt
 * 3. Go to Extensions -> Apps Script.
 * 4. Paste this code and click Save.
 * 5. Deploy -> New Deployment -> Web App -> Execute as "Me" -> Access "Anyone".
 */

const SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();
const SHEET_NAME = "Works";

function doGet(e) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const items = [];
  
  for (let i = 1; i < data.length; i++) {
    const item = {};
    headers.forEach((header, index) => {
      item[header] = data[i][index];
    });
    items.push(item);
  }
  
  // Return sorted by date (newest first)
  items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  return ContentService.createTextOutput(JSON.stringify({ status: 'success', data: items }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const postData = JSON.parse(e.postData.contents);
    const action = postData.action;
    const payload = postData.payload;
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    
    if (action === "CREATE") {
      const id = Utilities.getUuid();
      const createdAt = new Date().toISOString();
      sheet.appendRow([
        id, 
        payload.title, 
        payload.category, 
        payload.description, 
        payload.type, 
        payload.url, 
        createdAt
      ]);
      return createJsonResponse('success', 'Created');
    } 
    
    else if (action === "UPDATE") {
      const data = sheet.getDataRange().getValues();
      for (let i = 1; i < data.length; i++) {
        if (data[i][0] == payload.id) {
          sheet.getRange(i + 1, 1, 1, 7).setValues([[
            payload.id,
            payload.title,
            payload.category,
            payload.description,
            payload.type,
            payload.url,
            payload.createdAt
          ]]);
          break;
        }
      }
      return createJsonResponse('success', 'Updated');
    }
    
    else if (action === "DELETE") {
      const data = sheet.getDataRange().getValues();
      for (let i = 1; i < data.length; i++) {
        if (data[i][0] == payload.id) {
          sheet.deleteRow(i + 1);
          break;
        }
      }
      return createJsonResponse('success', 'Deleted');
    }
    
    return createJsonResponse('error', 'Unknown action');
  } catch (err) {
    return createJsonResponse('error', err.toString());
  }
}

function createJsonResponse(status, message) {
  return ContentService.createTextOutput(JSON.stringify({ status: status, message: message }))
    .setMimeType(ContentService.MimeType.JSON);
}
