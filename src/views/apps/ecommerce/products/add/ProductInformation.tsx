'use client'

import { useEffect, useState } from 'react'

// MUI Imports
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { Controller, useWatch, type Control, type FieldErrors, type UseFormSetValue } from 'react-hook-form'

import FormHelperText from '@mui/material/FormHelperText'

// Third-party Imports
import classnames from 'classnames'
import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Underline } from '@tiptap/extension-underline'
import { Placeholder } from '@tiptap/extension-placeholder'
import { TextAlign } from '@tiptap/extension-text-align'
import type { Editor } from '@tiptap/core'

import { Link } from '@tiptap/extension-link'
import { Blockquote } from '@tiptap/extension-blockquote'
import { OrderedList } from '@tiptap/extension-ordered-list'
import { BulletList } from '@tiptap/extension-bullet-list'
import { ListItem } from '@tiptap/extension-list-item'

// Components Imports
import CustomIconButton from '@core/components/mui/IconButton'

// Style Imports
import '@/libs/styles/tiptapEditor.css'

import type { ReadingType, RichTextChild, RichTextContent } from '@/types/apps/readingTypes'

type ReadingFormType = {
  title: string
  content: RichTextContent[]
  school: number
  writter: string
}

type ProductInformationProps = {
  control: Control<ReadingFormType>
  errors: FieldErrors<ReadingFormType>
  setValue: UseFormSetValue<ReadingFormType>
  initialData?: ReadingType
}

const EditorToolbar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null
  }

  return (
    <div className='flex flex-wrap gap-x-3 gap-y-1 pbs-5 pbe-4 pli-5'>
      <CustomIconButton
        {...(editor.isActive('bold') && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <i className={classnames('ri-bold', { 'text-textSecondary': !editor.isActive('bold') })} />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive('underline') && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <i className={classnames('ri-underline', { 'text-textSecondary': !editor.isActive('underline') })} />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive('italic') && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <i className={classnames('ri-italic', { 'text-textSecondary': !editor.isActive('italic') })} />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive('strike') && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <i className={classnames('ri-strikethrough', { 'text-textSecondary': !editor.isActive('strike') })} />
      </CustomIconButton>
      {/* <CustomIconButton
        {...(editor.isActive({ textAlign: 'left' }) && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
      >
        <i className={classnames('ri-align-left', { 'text-textSecondary': !editor.isActive({ textAlign: 'left' }) })} />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: 'center' }) && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
      >
        <i
          className={classnames('ri-align-center', {
            'text-textSecondary': !editor.isActive({ textAlign: 'center' })
          })}
        />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: 'right' }) && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
      >
        <i
          className={classnames('ri-align-right', {
            'text-textSecondary': !editor.isActive({ textAlign: 'right' })
          })}
        />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: 'justify' }) && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
      >
        <i
          className={classnames('ri-align-justify', {
            'text-textSecondary': !editor.isActive({ textAlign: 'justify' })
          })}
        />
      </CustomIconButton> */}
      <CustomIconButton
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        {...(editor.isActive('heading', { level: 1 }) && { color: 'primary' })}
      >
        <i className={classnames('ri-h-1', { 'text-textSecondary': !editor.isActive('heading', { level: 1 }) })} />
      </CustomIconButton>
      <CustomIconButton
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        {...(editor.isActive('heading', { level: 2 }) && { color: 'primary' })}
      >
        <i className={classnames('ri-h-2', { 'text-textSecondary': !editor.isActive('heading', { level: 2 }) })} />
      </CustomIconButton>
      <CustomIconButton
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        {...(editor.isActive('heading', { level: 3 }) && { color: 'primary' })}
      >
        <i className={classnames('ri-h-3', { 'text-textSecondary': !editor.isActive('heading', { level: 3 }) })} />
      </CustomIconButton>
      <CustomIconButton
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        {...(editor.isActive('heading', { level: 4 }) && { color: 'primary' })}
      >
        <i className={classnames('ri-h-4', { 'text-textSecondary': !editor.isActive('heading', { level: 4 }) })} />
      </CustomIconButton>
      <CustomIconButton
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        {...(editor.isActive('heading', { level: 5 }) && { color: 'primary' })}
      >
        <i className={classnames('ri-h-5', { 'text-textSecondary': !editor.isActive('heading', { level: 5 }) })} />
      </CustomIconButton>
      <CustomIconButton
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
        {...(editor.isActive('heading', { level: 6 }) && { color: 'primary' })}
      >
        <i className={classnames('ri-h-6', { 'text-textSecondary': !editor.isActive('heading', { level: 6 }) })} />
      </CustomIconButton>

      {/* List buttons */}
      <CustomIconButton
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        {...(editor.isActive('bulletList') && { color: 'primary' })}
      >
        <i className={classnames('ri-list-unordered', { 'text-textSecondary': !editor.isActive('bulletList') })} />
      </CustomIconButton>
      <CustomIconButton
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        {...(editor.isActive('orderedList') && { color: 'primary' })}
      >
        <i className={classnames('ri-list-ordered', { 'text-textSecondary': !editor.isActive('orderedList') })} />
      </CustomIconButton>

      {/* Quote button */}
      <CustomIconButton
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        {...(editor.isActive('blockquote') && { color: 'primary' })}
      >
        <i className={classnames('ri-quote-text', { 'text-textSecondary': !editor.isActive('blockquote') })} />
      </CustomIconButton>

      {/* Link button */}
      <CustomIconButton
        variant='outlined'
        size='small'
        onClick={() => {
          const url = window.prompt('Enter the URL')

          if (url) {
            editor.chain().focus().setLink({ href: url }).run()
          }
        }}
        {...(editor.isActive('link') && { color: 'primary' })}
      >
        <i className={classnames('ri-link', { 'text-textSecondary': !editor.isActive('link') })} />
      </CustomIconButton>
    </div>
  )
}

const ProductInformation = ({ control, errors, setValue, initialData }: ProductInformationProps) => {
  const watchedContent = useWatch({
    control,
    name: 'content'
  })

  const [content, setContent] = useState(``)

  const convertNodeChildren = (nodeContent?: any[]): RichTextChild[] => {
    if (!nodeContent) return []

    // Filter dan map konten yang memiliki teks
    return nodeContent
      .filter(child => {
        // Pastikan child memiliki teks yang tidak kosong
        return (child.text && child.text.trim() !== '') || child.type === 'link'
      })
      .map(child => {
        let richTextChild: RichTextChild

        // Handle link type differently
        if (child.marks?.some((mark: any) => mark.type === 'link')) {
          const linkMark = child.marks.find((mark: any) => mark.type === 'link')

          richTextChild = {
            type: 'link',
            url: linkMark.attrs.href,
            children: [{ type: 'text', text: child.text || '' }]
          }
        } else {
          // Handle regular text
          richTextChild = {
            type: 'text',
            text: child.text
          }

          // Add other marks
          if (child.marks) {
            child.marks.forEach((mark: any) => {
              switch (mark.type) {
                case 'bold':
                  richTextChild.bold = true
                  break
                case 'italic':
                  richTextChild.italic = true
                  break
                case 'strike':
                  richTextChild.strikethrough = true
                  break
                case 'underline':
                  richTextChild.underline = true
                  break
              }
            })
          }
        }

        return richTextChild
      })
  }

  const convertEditorContentToRichText = (editor: Editor): RichTextContent[] => {
    const richTextContent: RichTextContent[] = []
    const jsonContent = editor.getJSON()

    jsonContent.content?.forEach(node => {
      switch (node.type) {
        case 'paragraph':
          const paragraphChildren = convertNodeChildren(node.content)

          // Jika tidak ada children, tambahkan paragraph dengan teks kosong
          if (paragraphChildren.length === 0) {
            richTextContent.push({
              type: 'paragraph',
              children: [{ type: 'text', text: '' }]
            })
          } else {
            richTextContent.push({
              type: 'paragraph',
              children: paragraphChildren
            })
          }

          break

        case 'heading':
          const headingChildren = convertNodeChildren(node.content)

          if (headingChildren.length === 0) {
            richTextContent.push({
              type: 'heading',
              level: node.attrs?.level || 1,
              children: [{ type: 'text', text: '' }]
            })
          } else {
            richTextContent.push({
              type: 'heading',
              level: node.attrs?.level || 1,
              children: headingChildren
            })
          }

          break

        case 'bulletList':
          const unorderedChildren =
            node.content
              ?.map(item => {
                // Pastikan kita menangani struktur list item dengan benar
                const listItemContent = item.content?.[0]?.content
                const listItemChildren = convertNodeChildren(listItemContent)

                return {
                  type: 'list-item' as const,
                  children: listItemChildren.length > 0 ? listItemChildren : [{ type: 'text', text: '' }]
                }
              })
              .filter(item => item.children.length > 0) || []

          if (unorderedChildren.length > 0) {
            richTextContent.push({
              type: 'list',
              format: 'unordered',
              children: unorderedChildren as { type: 'list-item'; children: RichTextChild[] }[]
            })
          }

          break

        case 'orderedList':
          const orderedChildren =
            node.content
              ?.map(item => {
                // Pastikan kita menangani struktur list item dengan benar
                const listItemContent = item.content?.[0]?.content
                const listItemChildren = convertNodeChildren(listItemContent)

                return {
                  type: 'list-item' as const,
                  children: listItemChildren.length > 0 ? listItemChildren : [{ type: 'text', text: '' }]
                }
              })
              .filter(item => item.children.length > 0) || []

          if (orderedChildren.length > 0) {
            richTextContent.push({
              type: 'list',
              format: 'ordered',
              children: orderedChildren as { type: 'list-item'; children: RichTextChild[] }[]
            })
          }

          break

        case 'blockquote':
          // Pastikan kita menangani struktur blockquote dengan benar
          const quoteContent = node.content?.[0]?.content
          const quoteChildren = convertNodeChildren(quoteContent)

          if (quoteChildren.length > 0) {
            richTextContent.push({
              type: 'quote',
              children: quoteChildren
            })
          }

          break
      }
    })

    return richTextContent
  }

  const convertChildren = (children: RichTextChild[]): string => {
    return children
      .map(child => {
        if (child.type === 'text') {
          let text = child.text || ''

          if (child.bold) text = `<strong>${text}</strong>`
          if (child.italic) text = `<em>${text}</em>`
          if (child.underline) text = `<u>${text}</u>`
          if (child.strikethrough) text = `<s>${text}</s>`

          return text
        }

        if (child.type === 'link' && child.url) {
          return `<a target="_self" rel="noopener noreferrer nofollow" class="sc-bdvvL fjQbXd sc-BHvUt jSstzL" href="${child.url}">${convertChildren(child.children || [])}</a>`
        }

        return ''
      })
      .join('')
  }

  const convertContentToHtml = (content: RichTextContent[]): string => {
    return content
      .map((node, index, array) => {
        switch (node.type) {
          case 'paragraph':
            return `<p>${convertChildren(node.children as RichTextChild[])}</p>`

          case 'heading':
            return `<h${node.level || 1}>${convertChildren(node.children as RichTextChild[])}</h${node.level || 1}>`

          case 'list': {
            const tag = node.format === 'ordered' ? 'ol' : 'ul'

            const listItems = (node.children as { type: 'list-item'; children: RichTextChild[] }[])
              .map(item => `<li><p>${convertChildren(item.children)}</p></li>`)
              .join('')

            // Only add paragraph after list if needed
            const nextNode = array[index + 1]
            const needsParagraph = nextNode && nextNode.type !== 'list' && nextNode.type !== 'paragraph'

            return `<${tag}>${listItems}</${tag}>${needsParagraph ? '<p></p>' : ''}`
          }

          case 'quote':
            return `<blockquote><p>${convertChildren(node.children as RichTextChild[])}</p></blockquote>`

          default:
            return ''
        }
      })
      .join('')
  }

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6]
        },
        blockquote: false,
        orderedList: false,
        bulletList: false,
        listItem: false
      }),
      Blockquote,
      OrderedList,
      BulletList,
      ListItem,
      Link.configure({
        openOnClick: false,
        autolink: false
      }),
      Placeholder.configure({
        placeholder: 'Write something here...'
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      Underline
    ],
    content: content,
    onUpdate: ({ editor }) => {
      // Update konten lokal
      setContent(editor.getHTML())

      // Konversi dan kirim update
      const richTextContent = convertEditorContentToRichText(editor)

      setValue('content', richTextContent, {
        shouldValidate: true,
        shouldDirty: true
      })
    }
  })

  useEffect(() => {
    if (editor && !editor.isDestroyed && watchedContent) {
      const currentContent = convertEditorContentToRichText(editor)

      if (JSON.stringify(currentContent) !== JSON.stringify(watchedContent)) {
        editor.commands.setContent(watchedContent)
      }
    }
  }, [editor, watchedContent])

  useEffect(() => {
    if (initialData?.content) {
      const htmlContent = convertContentToHtml(initialData.content)

      setContent(htmlContent)

      if (editor && !editor.isDestroyed) {
        editor.commands.setContent(htmlContent)
      }
    }
  }, [initialData, editor])

  return (
    <Card>
      <CardHeader title='Content Information' />
      <CardContent>
        <Grid container spacing={5} className='mbe-5'>
          <Grid item xs={12}>
            <Controller
              name='title'
              control={control}
              rules={{ required: 'Title is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label='Title Content'
                  placeholder='Write your title ...'
                  error={!!errors.title}
                  helperText={errors.title?.message}
                />
              )}
            />
          </Grid>
        </Grid>
        <Typography className='mbe-1'>Description (Optional)</Typography>
        <Card className='p-0 border shadow-none'>
          <CardContent className='p-0'>
            <EditorToolbar editor={editor} />
            <Divider className='mli-5' />
            <EditorContent editor={editor} className='bs-[235px] overflow-y-auto flex ' />
            {errors.content && (
              <FormHelperText error className='pli-4 pbe-2'>
                {errors.content.message}
              </FormHelperText>
            )}
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}

export default ProductInformation
