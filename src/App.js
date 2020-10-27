import React from 'react';
import './App.css';
import axios from 'axios';
import filterFactory, { textFilter,selectFilter  } from 'react-bootstrap-table2-filter';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import $ from 'jquery';

class App extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        data:[],
        selectPlatformOptions:{value:'',label:''},
        selectScoreOptions:{value:'',label:''},
        selectGenreOptions:{value:'',label:''},
        selectEditorsChoice:{value:'',label:''},
      }
    }
    
  componentDidMount(){
      axios.get("http://starlord.hackerearth.com/gamesarena")
      .then(res=>{
          let data = res.data.slice(1,);
          var distinct_platforms = new Set();
          var distinct_score = new Set();
          var distinct_genre = new Set();
          var distinct_Choice = new Set();
          var platform_list=[];
          var score_List=[];
          var genre_List=[];
          var choice_list=[];
          data.forEach(val=>{
            distinct_platforms.add(val["platform"]);
            distinct_score.add(val["score"])
            distinct_genre.add(val["genre"])
            distinct_Choice.add(val["editors_choice"])
          })
          distinct_score = Array.from(distinct_score).sort();
          distinct_platforms = Array.from(distinct_platforms).sort();
          distinct_platforms.forEach(val=>{
            if(val){
              let obj = {value:val,label:val};
              platform_list.push(obj)
            }
          })
          distinct_score.forEach(val=>{
            if(val){
              let obj = {value:val,label:val};
              score_List.push(obj)
            }
          })
          distinct_genre.forEach(val=>{
            if(val){
              let obj = {value:val,label:val};
              genre_List.push(obj)
            }
          })
          distinct_Choice.forEach(val=>{
            if(val){
              let obj = {value:val,label:val};
              choice_list.push(obj)
            }
          })
          this.setState({
            data:data,
            selectPlatformOptions:platform_list,
            selectScoreOptions:score_List,
            selectGenreOptions:genre_List,
            selectEditorsChoice:choice_list,
          })
      })
      .catch(err=>{
          console.log("Something went wrong while retriving Data")
      })
  }
  componentDidUpdate(){
    $(document).unbind().on("change","input.text-filter",function(){
      setTimeout(() => {
        $(".errMsgDisp").css("display","none")
        var tbody = $(".react-bootstrap-table table tbody");
        if (tbody.children().length == 0) {
          $(".errMsgDisp").css("display","block");
        }
      }, 500);
    })
    $(".react-bootstrap-table table th").unbind().on("click",function(){
      setTimeout(() => {
        $(".errMsgDisp").css("display","none")
        var tbody = $(".react-bootstrap-table table tbody");
        if (tbody.children().length == 0) {
          $(".errMsgDisp").css("display","block");
        }
      }, 500);
    })
  }
  render() {
    let columns=[]
    if(this.state.selectPlatformOptions.length>0 &&
      this.state.selectScoreOptions.length>0 &&
      this.state.selectGenreOptions.length>0 &&
      this.state.selectEditorsChoice.length>0
      ){
        console.log(this.state.selectGenreOptions)
        columns = [
          {
            dataField: 'title',
            text: 'Title',
            filter: textFilter(),
            sort: true
          },
          {
            dataField: 'platform',
            text: 'Platform',
            formatter: cell => this.state.selectPlatformOptions.find(opt => opt.value === cell).label,
            filter: selectFilter({
              options: this.state.selectPlatformOptions
            }),
            sort: true
          },
          {
            dataField: 'score',
            text: 'Score',
            formatter: cell => this.state.selectScoreOptions.find(opt => opt.value === cell).label,
            filter: selectFilter({
              options: this.state.selectScoreOptions
            }),
            sort: true
          },
          {
            dataField: 'genre',
            text: 'Genre',
            filter: textFilter(),
            // formatter: cell => this.state.selectGenreOptions.find(opt => opt.value === cell).label,
            // filter: selectFilter({
            //   options: this.state.selectGenreOptions
            // })
            sort: true
          },
          {
            dataField: 'editors_choice',
            text: 'Editors Choice',
            formatter: cell => this.state.selectEditorsChoice.find(opt => opt.value === cell).label,
            filter: selectFilter({
              options: this.state.selectEditorsChoice
            }),
            sort: true
          }
        ]
      }
    return  <>
    {this.state.data.length>0?
    <BootstrapTable keyField='id' data={ this.state.data } columns={ columns } filter={ filterFactory()} striped
    hover condensed pagination={ paginationFactory() } />:null}
    <div className="errMsgDisp">No Records found for the searched criteria</div>
    <marquee>Clicking on the headers will sort the corresponding column</marquee>
            </>
  }
}

export default App;
