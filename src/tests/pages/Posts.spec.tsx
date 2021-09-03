import { render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils'
import Post, {getStaticProps} from '../../pages/posts';

import { getPrismicClient } from '../../services/prismic'

const posts = [
  {
    slug: 'my-new-post', title: 'My New Post', excerpt: 'Post excerpt', updatedAt: '10 de Abril'
  }
]

jest.mock('../../services/prismic.ts')
jest.mock('next-auth/client', () => {
  return {
    useSession: () => [null, false]
  }
})

describe('Posts Page', () => {
  it('render correctly', () => {
    render(<Post posts={posts} />)

    expect(screen.getByText('My New Post')).toBeInTheDocument();
  })

  it('loads initial datas', async () => {
    const getPrismicClientMocked = mocked(getPrismicClient)

    getPrismicClientMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
	results: [
	  {
	    uid: 'my-new-post',
	    data: {
	      title: [
		{ type: 'heading', text: 'My new post' }
	      ],
	      content: [
		{ type: 'paragraph', text: 'Post excerpt' }
	      ]
	    },
	    last_publication_date: '08-28-2021'
	  }
	]
      })
    } as any)

    const response = await getStaticProps({})

    expect(response).toEqual(expect.objectContaining({
      props: {
	posts: [{
	  slug: 'my-new-post',
	  title: 'My new post',
	  excerpt: 'Post excerpt',
	  updatedAt: '28 de agosto de 2021'
	}]
      }
    }))
  })
})
