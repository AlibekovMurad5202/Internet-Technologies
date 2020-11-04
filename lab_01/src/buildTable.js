function buildTable(tableContent)
{
	if (!document.getElementById('table'))
	{
		var rowsCount = tableContent.length;
		var cellsCount = tableContent[0].length;

		var table = document.createElement('table');
		table.id = 'table';
		table.width = '75%';
		table.cellspacing = '0';
		table.cellpadding = '4';
		table.border = '1';

		var header = document.createElement('thead');
		table.appendChild(header);
		var firstRow = document.createElement('tr');
		header.appendChild(firstRow);
		for (var i = 0; i < cellsCount; i++)
		{
			var newCell = document.createElement('td');
			newCell.appendChild(document.createTextNode(tableContent[0][i]));
			firstRow.appendChild(newCell);
		}

		var body = document.createElement('tbody');
		table.appendChild(body);
		for (var j = 1; j < rowsCount; j++)
		{
			var newRow = document.createElement('tr');
			body.appendChild(newRow);
			for (var i = 0; i < cellsCount; i++)
			{
				var newCell = document.createElement('td');
				newCell.appendChild(document.createTextNode(tableContent[j][i]));
				newRow.appendChild(newCell);
			}
		}

		document.body.appendChild(table);
	}
	else
	{
		alert('Таблица уже существует');
	}
}
