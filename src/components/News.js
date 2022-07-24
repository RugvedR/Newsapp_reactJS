import React, { Component } from 'react'
import NewsItem from './NewsItem'
import './News.css';
import Spinner from './Spinner';
import PropTypes from 'prop-types'


export class News extends Component {

  static defaultProps = {
    country: 'in',
    pageSize: 9,
    category: 'general'
  }

  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string
  }

    constructor(){
        super();
        this.state = {
            articles: [],
            loading: false,
            page: 1
        }
    }

    async componentDidMount(){
        console.log('component did mount method')
        let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=e1653ca971fc4304a17cd692bf3efd76&page=1&pageSize=${this.props.pageSize}`;
        this.setState({loading: true})
        let data = await fetch(url);
        let parsedData = await data.json();
        console.log(parsedData);
        this.setState({articles: parsedData.articles, totalResults: parsedData.totalResults, loading:false});
    }
    
    handlePrevClick = async ()=>{
      console.log("previous clicked");
      
      let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=e1653ca971fc4304a17cd692bf3efd76&page=${this.state.page-1}&pageSize=${this.props.pageSize}`;
      this.setState({loading: true})
      let data = await fetch(url);
      let parsedData = await data.json();

      this.setState({
        page: this.state.page - 1,
        articles: parsedData.articles,
        loading: false
      });

    }

    handleNextClick = async ()=>{
      window.scrollTo(0,0);
      console.log("next clicked");

      if(!(this.state.page+1 > Math.ceil(this.state.totalResults/this.props.pageSize))){
        let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=e1653ca971fc4304a17cd692bf3efd76&page=${this.state.page+1}&pageSize=${this.props.pageSize}`;
        this.setState({loading: true})
        let data = await fetch(url);
        let parsedData = await data.json();
        
        this.setState({
          page: this.state.page + 1,
          articles: parsedData.articles,
          loading: false
        });
      }
    }

  render() {
    return (
      <div className='container my-3' >
        <h1 className='text-center' style={{marginTop: '100px', marginBottom:'20px'}} > <strong>NewZap</strong> - {(this.props.category)[0].toUpperCase()+(this.props.category).substring(1)}</h1>
        {this.state.loading && <Spinner/>}
        <div className="row">
            {!this.state.loading && this.state.articles.map((element)=>{
                return (<div className="col-md-4" key={element.url}>
                    <NewsItem title={element.title?element.title.slice(0,40):""} description={element.description?element.description.slice(0,80):""} imageUrl={element.urlToImage} newsUrl={element.url} />
                </div>)
            })}
            {/* <div className="col-md-4">
                    <NewsItem title='hello' description='{element.description?element.description.slice(0,80):""}' imageUrl='{element.urlToImage}' newsUrl='{element.url}' />
                </div> */}
             
        </div>
        <div className="container d-flex justify-content-between">
          <button disabled={this.state.page<=1} type="button" className="btn btn-dark" onClick={this.handlePrevClick} >&larr; Previous</button>
          {/* <div className="page-indicator">Page {this.state.page}</div> */}
          <button disabled={this.state.page+1 > Math.ceil(this.state.totalResults/this.props.pageSize)} type="button" className="btn btn-dark" onClick={this.handleNextClick} >Next &rarr;</button>
        </div>
      </div>
    )
  }
}

export default News
