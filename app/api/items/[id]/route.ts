import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabaseClient';

type Props = {
  params: Record<string, string>
};

export async function GET(request: NextRequest, { params }: Props) { 
  let { data: items, error } = await supabase
    .from('items')
    .select('*')
    .eq('id', params.id);
  
  if (error) {
    console.error('Error fetching data:', error.message);
    return NextResponse.json({ error: 'Error fetching data' }, { status: 500 });
  }
  
  if (items?.length) {
    const res = NextResponse.json(items[0]);
    res.headers.set('Cache-Control', 'no-store, max-age=0');
    return res;
  } else {
    return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
  }
}
