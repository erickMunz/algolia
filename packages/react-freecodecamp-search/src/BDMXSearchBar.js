import React from 'react';
import PropTypes from 'prop-types';
import find from 'lodash/find';
import { SearchBox, InstantSearch, Configure } from 'react-instantsearch/dom';
import qs from 'query-string';

import SearchHits from './components/SearchHits';
import { algolia, overrides } from './css';

const propTypes = {
  placeholder: PropTypes.string
};

const defaultProps = {
  placeholder: 'Busca entre nuestras guias seguro te sorprenderas'
};

const defaultPrefixRE = /^search\sfor\s\"/i;
const defalutPostfixRE = /\"$/;

function stripDefaultFixes(str) {
  return str.replace(defaultPrefixRE, '').replace(defalutPostfixRE, '');
}

function openSearchWindow(query = '') {
  return window.open(
    `https://localhost:8000/?${qs.stringify({ q: query })}`,
    '_blank'
  );
}

const handleSubmit = e => {
  e.preventDefault();
  console.log(e);
  const query = stripDefaultFixes(e.target.parentElement.innerText);
  const fallbackQueryNode = find(
    [...document.querySelectorAll('[data-fccobjectid]')],
    node => node.dataset.fccobjectid.includes('default-hit-')
  );
  const fallbackQuery = stripDefaultFixes(fallbackQueryNode.innerText);
  if (!query) {
    // user did not click on a suggestion
    // instead they pressed enter or clicked the search button
    return openSearchWindow(fallbackQuery);
  }
  return openSearchWindow(query);
};

class BDMXSearchBar extends React.PureComponent {
  componentDidMount() {
    const searchInput = document.querySelector('.ais-SearchBox-input');
    searchInput.id = 'fcc_instantsearch';
  }
  render() {
    const { placeholder } = this.props;
    return (
      <div className='fcc_searchBar'>
        <style
          dangerouslySetInnerHTML={{ __html: algolia.concat(overrides) }}
        />
        <InstantSearch
          apiKey='c690254fe0f1b92c7fd6183feb92e0c9'
          appId='NCCR9CY838'
          indexName='guides'
          >
          <div className='fcc_search_wrapper'>
            <label className='fcc_sr_only' htmlFor='fcc_instantsearch'>
              Search
            </label>
            <SearchBox onSubmit={handleSubmit} translations={{ placeholder }} />
            <div className='fcc_hits_wrapper'>
              <SearchHits handleSubmit={handleSubmit} />
            </div>
          </div>
          <Configure hitsPerPage={8} />
        </InstantSearch>
      </div>
    );
  }
}

BDMXSearchBar.defaultProps = defaultProps;
BDMXSearchBar.displayName = 'BDMXSearchBar';
BDMXSearchBar.propTypes = propTypes;

export default BDMXSearchBar;
