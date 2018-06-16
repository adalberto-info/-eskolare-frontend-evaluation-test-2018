const React = require('react');
const ReactDataGrid = require('react-data-grid');
const exampleWrapper = require('../components/exampleWrapper');
const { Toolbar, Data: { Selectors }, Editors, Formatters } = require('react-data-grid-addons');
import update from 'immutability-helper';
const { AutoComplete: AutoCompleteEditor, DropDownEditor } = Editors;

class Example extends React.Component {
  constructor(props, context) {
    super(props, context);
    this._columns = [
      {
        key: 'id',
        name: 'ID',
        width: 80,
        filterable: true,
        sortable: true 
      },
      {
        key: 'task',
        name: 'Title',
        filterable: true,
        sortable: true,
        editable: true
      },
      {
        key: 'priority',
        name: 'Priority',
        filterable: true,
        sortable: true,
        editable: true
      },
      {
        key: 'issueType',
        name: 'Issue Type',
        filterable: true,
        sortable: true,
        editable: true
      },
      {
        key: 'complete',
        name: '% Complete',
        filterable: true,
        sortable: true,
        editable: true
      },
      {
        key: 'startDate',
        name: 'Start Date',
        filterable: true,
        sortable: true,
        editable: true
      },
      {
        key: 'completeDate',
        name: 'Expected Complete',
        filterable: true,
        sortable: true,
        editable: true
      }
    ];

    let originalRows = this.createRows(1000);
    let rows = originalRows.slice(0);
    this.state = { rows: this.createRows(), originalRows, filters: {}, value: 1, scrollToRowIndex: 0};

  }

  getRandomDate = (start, end) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toLocaleDateString();
  };

  createRows = () => {
    let rows = [];
    for (let i = 1; i < 1000; i++) {
      rows.push({
        id: i,
        task: 'Task ' + i,
        complete: Math.min(100, Math.round(Math.random() * 110)),
        priority: ['Critical', 'High', 'Medium', 'Low'][Math.floor((Math.random() * 3) + 1)],
        issueType: ['Bug', 'Improvement', 'Epic', 'Story'][Math.floor((Math.random() * 3) + 1)],
        startDate: this.getRandomDate(new Date(2015, 3, 1), new Date()),
        completeDate: this.getRandomDate(new Date(), new Date(2016, 0, 1))
      });
    }

    return rows;
  };

  getRows = () => {
    return Selectors.getRows(this.state);
  };

  getSize = () => {
    return this.getRows().length;
  };

  handleGridSort = (sortColumn, sortDirection) => {
    const comparer = (a, b) => {
      if (sortDirection === 'ASC') {
        return (a[sortColumn] > b[sortColumn]) ? 1 : -1;
      } else if (sortDirection === 'DESC') {
        return (a[sortColumn] < b[sortColumn]) ? 1 : -1;
      }
    };

    const rows = sortDirection === 'NONE' ? this.state.originalRows.slice(0) : this.state.rows.sort(comparer);

    this.setState({ rows });
  };

  rowGetter = (rowIdx) => {
    let rows = this.getRows();
    return rows[rowIdx];
  };

  handleFilterChange = (filter) => {
    let newFilters = Object.assign({}, this.state.filters);
    if (filter.filterTerm) {
      newFilters[filter.column.key] = filter;
    } else {
      delete newFilters[filter.column.key];
    }
    this.setState({ filters: newFilters });
  };

  onClearFilters = () => {
    // all filters removed
    this.setState({filters: {} });
  };

  handleGridRowsUpdated = ({ fromRow, toRow, updated }) => {
    let rows = this.state.rows.slice();

    for (let i = fromRow; i <= toRow; i++) {
      let rowToUpdate = rows[i];
      let updatedRow = update(rowToUpdate, {$merge: updated});
      rows[i] = updatedRow;
    }

    this.setState({ rows });
  };
  
  handleAddRow = ({ newRowIndex }) => {
    const newRow = {
      value: newRowIndex,
      userStory: '',
      developer: '',
      epic: ''
    };

    let rows = this.state.rows.slice();
    rows = update(rows, {$push: [newRow]});
    this.setState({ rows });
  };

  getRowAt = (index) => {
    if (index < 0 || index > this.getSize()) {
      return undefined;
    }

    return this.state.rows[index];
  };

  getColumns = () => {
    let clonedColumns = this._columns.slice();
    clonedColumns[2].events = {
      onClick: (ev, args) => {
        const idx = args.idx;
        const rowIdx = args.rowIdx;
        this.grid.openCellEditor(rowIdx, idx);
      }
    };

    return clonedColumns;
  };
  
//  render() {
//    return (
//      <div>
//        <div style={{display: 'flex', marginBottom: '10px', alignItems: 'center'}}>
//          <span style={{marginRight: '10px'}}>Row Index: </span>
//          <input
//            style={{marginRight: '10px', border: '1px outset lightgray', padding: '3px'}}
//            type='text'
//            value={this.state.value}
//            onChange={(event) => { this.setState({value: event.target.value})}} />
//          <button
//            style={{padding: '5px'}}
//            onClick={() => this.setState({scrollToRowIndex: this.state.value == 1 ? -1 : (this.state.value-1)})}>Scroll to row</button>
//        </div>
//        <ReactDataGrid
//          onGridSort={this.handleGridSort}
//          columns={this._columns}
//          rowGetter={this.rowGetter}
//          enableCellSelect={true}
//          rowsCount={this.getSize()}
//          minHeight={500}
//          onGridRowsUpdated={this.handleGridRowsUpdated}
//         toolbar={<Toolbar enableFilter={true} onAddRow={this.handleAddRow}/>}
//          onAddFilter={this.handleFilterChange}
//          onClearFilters={this.onClearFilters} 
//          scrollToRowIndex={this.state.scrollToRowIndex} />
//      </div>
//      );
  render() {
    return (
    <ReactDataGrid
      ref={ node => this.grid = node }
      enableCellSelect={true}
      columns={this.getColumns()}
      rowGetter={this.getRowAt}
      rowsCount={this.getSize()}
      onGridRowsUpdated={this.handleGridRowsUpdated}
      toolbar={<Toolbar onAddRow={this.handleAddRow}/>}
      enableRowSelect={true}
      rowHeight={50}
      minHeight={600}
      rowScrollTimeout={200} />);
}

//  }
}

module.exports = exampleWrapper({
  WrappedComponent: Example,
  exampleName: 'eskolare-frontend-evaluation-test-2018',
  exampleDescription: 'Desafio: Criar Tabela.',
  examplePath: './scripts/example09-filterable-grid.js',
  examplePlaygroundLink: undefined
});

